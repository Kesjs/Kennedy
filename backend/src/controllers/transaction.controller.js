const { createError } = require('http-errors');
const supabase = require('../config/supabase');

// Adresses de dépôt pour les cryptomonnaies
const CRYPTO_ADDRESSES = {
  BTC: 'bc1q0ulp4sauly9sahsq7jswy94ane0ev9ksjtvpzn',
  USDT: '0x63eF5b765D8d408274172804D31fB0a2Ea5416c0',
  ETH: '0x63eF5b765D8d408274172804D31fB0a2Ea5416c0', // Même adresse que USDT (ERC-20)
  // Ajoutez d'autres paires de devises/adresses au besoin
};

// Obtenir l'historique des transactions
exports.getTransactionHistory = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { type, status, limit = 10, offset = 0 } = req.query;

    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filtrer par type si fourni
    if (type) {
      query = query.in('type', Array.isArray(type) ? type : [type]);
    }

    // Filtrer par statut si fourni
    if (status) {
      query = query.in('status', Array.isArray(status) ? status : [status]);
    }

    const { data: transactions, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir les détails d'une transaction spécifique
exports.getTransactionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !transaction) {
      throw createError(404, 'Transaction not found');
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Créer une demande de retrait
exports.createWithdrawalRequest = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { amount, walletAddress, network } = req.body;

    // Vérifier le solde de l'utilisateur
    const { data: balance, error: balanceError } = await supabase.rpc('get_user_balance', {
      p_user_id: userId
    });

    if (balanceError) throw balanceError;

    if (balance.available_balance < amount) {
      throw createError(400, 'Insufficient balance');
    }

    // Créer la transaction de retrait
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          type: 'withdrawal',
          amount: amount,
          status: 'pending',
          metadata: {
            wallet_address: walletAddress,
            network: network || 'TRC20',
            fee: 0 // À implémenter avec la logique de frais
          }
        }
      ])
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Mettre à jour le solde de l'utilisateur (à implémenter avec une fonction RPC)
    const { error: updateError } = await supabase.rpc('update_user_balance', {
      p_user_id: userId,
      p_amount: -amount,
      p_transaction_id: transaction.id
    });

    if (updateError) throw updateError;

    // Envoyer une notification à l'utilisateur
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: 'Withdrawal Request Received',
          message: `Your withdrawal request of $${amount} is being processed.`,
          type: 'transaction',
          metadata: {
            transaction_id: transaction.id
          }
        }
      ]);

    res.status(201).json({
      success: true,
      message: 'Withdrawal request created successfully',
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Traiter un dépôt
exports.processDeposit = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { amount, currency = 'EUR', paymentMethod, isInitialDeposit = false } = req.body;

    // Validation du montant
    const minDeposit = isInitialDeposit ? 50 : 10; // 50€ minimum pour le dépôt initial, 10€ sinon
    if (amount < minDeposit) {
      throw createError(400, `Le montant minimum pour un dépôt est de ${minDeposit} ${currency}`);
    }

    // Vérifier si c'est un dépôt initial et s'il a déjà été effectué
    if (isInitialDeposit) {
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('has_initial_deposit')
        .eq('user_id', userId)
        .single();

      if (settingsError) throw settingsError;
      if (settings?.has_initial_deposit) {
        throw createError(400, 'Un dépôt initial a déjà été effectué pour ce compte');
      }
    }

    // Vérifier si la méthode de paiement est valide
    const validPaymentMethods = ['bank_transfer', 'credit_card', 'crypto'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      throw createError(400, 'Méthode de paiement non valide');
    }

    // Si c'est un dépôt en crypto, vérifier que la devise est prise en charge
    if (paymentMethod === 'crypto' && !CRYPTO_ADDRESSES[currency]) {
      throw createError(400, `La devise ${currency} n'est pas prise en charge pour les dépôts en crypto`);
    }

    // Obtenir ou créer le portefeuille de l'utilisateur
    let { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .upsert(
        { user_id: userId, currency, is_active: true },
        { onConflict: 'user_id,currency', ignoreDuplicates: false }
      )
      .select()
      .single();

    if (walletError) throw walletError;

    // Créer la transaction de dépôt
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          wallet_id: wallet.id,
          amount,
          currency,
          type: 'deposit',
          status: paymentMethod === 'crypto' ? 'pending' : 'completed',
          payment_method: paymentMethod,
          description: isInitialDeposit ? 'Dépôt initial' : 'Dépôt de fonds',
          metadata: {
            is_initial_deposit: isInitialDeposit,
            crypto_address: paymentMethod === 'crypto' ? CRYPTO_ADDRESSES[currency] : null
          }
        }
      ])
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Si ce n'est pas un dépôt en attente, mettre à jour le solde du portefeuille
    if (paymentMethod !== 'crypto') {
      const { error: updateError } = await supabase.rpc('update_wallet_balance', {
        p_wallet_id: wallet.id,
        p_amount: amount,
        p_operation: 'add'
      });

      if (updateError) throw updateError;

      // Mettre à jour le statut de dépôt initial si nécessaire
      if (isInitialDeposit) {
        const { error: settingsUpdateError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: userId,
            has_initial_deposit: true,
            updated_at: new Date().toISOString()
          });

        if (settingsUpdateError) throw settingsUpdateError;
      }
    }

    // Préparer la réponse
    const response = {
      success: true,
      message: paymentMethod === 'crypto' 
        ? `Veuillez envoyer ${amount} ${currency} à l'adresse suivante : ${CRYPTO_ADDRESSES[currency]}`
        : 'Dépôt effectué avec succès',
      data: {
        transaction,
        depositAddress: paymentMethod === 'crypto' ? CRYPTO_ADDRESSES[currency] : null,
        isInitialDeposit,
        requiresConfirmation: paymentMethod === 'crypto'
      }
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// Annuler une demande de retrait en attente
exports.cancelWithdrawalRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Vérifier si la transaction existe et appartient à l'utilisateur
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .select('id, amount, status, type')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (transactionError || !transaction) {
      throw createError(404, 'Transaction not found');
    }

    if (transaction.type !== 'withdrawal') {
      throw createError(400, 'Only withdrawal transactions can be cancelled');
    }

    if (transaction.status !== 'pending') {
      throw createError(400, 'Only pending withdrawals can be cancelled');
    }

    // Mettre à jour le statut de la transaction
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Rembourser le montant à l'utilisateur (si nécessaire)
    if (transaction.amount > 0) {
      await supabase.rpc('update_user_balance', {
        p_user_id: userId,
        p_amount: transaction.amount,
        p_transaction_id: transaction.id
      });
    }

    // Envoyer une notification à l'utilisateur
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: 'Withdrawal Cancelled',
          message: `Your withdrawal request of $${transaction.amount} has been cancelled.`,
          type: 'transaction',
          metadata: {
            transaction_id: transaction.id
          }
        }
      ]);

    res.json({
      success: true,
      message: 'Withdrawal request cancelled successfully',
      data: updatedTransaction
    });
  } catch (error) {
    next(error);
  }
};
