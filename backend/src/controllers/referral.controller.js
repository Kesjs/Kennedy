const { createError } = require('http-errors');
const supabase = require('../config/supabase');

// Obtenir les statistiques de parrainage
exports.getReferralStats = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Obtenir le nombre total de filleuls
    const { data: referralsCount, error: countError } = await supabase.rpc('get_referral_count', {
      p_user_id: userId
    });

    if (countError) throw countError;

    // Obtenir les commissions totales
    const { data: totalEarnings, error: earningsError } = await supabase.rpc('get_referral_earnings', {
      p_user_id: userId
    });

    if (earningsError) throw earningsError;

    // Obtenir les filleuls récents
    const { data: recentReferrals, error: refError } = await supabase
      .from('referrals')
      .select(`
        id,
        created_at,
        status,
        referred_user:referred_id (
          id,
          email,
          first_name,
          last_name,
          created_at
        )
      `)
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (refError) throw refError;

    res.json({
      success: true,
      data: {
        totalReferrals: referralsCount || 0,
        activeReferrals: referralsCount?.active || 0,
        totalEarnings: totalEarnings?.total_earnings || 0,
        availableBalance: totalEarnings?.available_balance || 0,
        recentReferrals: recentReferrals || []
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtenir la liste complète des filleuls
exports.getReferralList = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { status, limit = 10, offset = 0 } = req.query;

    let query = supabase
      .from('referrals')
      .select(
        `
        id,
        created_at,
        status,
        level,
        total_earned,
        referred_user:referred_id (
          id,
          email,
          first_name,
          last_name,
          created_at,
          last_login
        )
      `,
        { count: 'exact' }
      )
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filtrer par statut si fourni
    if (status) {
      query = query.in('status', Array.isArray(status) ? status : [status]);
    }

    const { data: referrals, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: referrals,
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

// Obtenir l'historique des commissions
exports.getCommissionHistory = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { limit = 10, offset = 0 } = req.query;

    const { data: commissions, error, count } = await supabase
      .from('referral_commissions')
      .select(
        `
        id,
        amount,
        level,
        status,
        created_at,
        referral:referral_id (
          referred_user:referred_id (
            id,
            email,
            first_name,
            last_name
          )
        )
      `,
        { count: 'exact' }
      )
      .eq('referrer_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Formater les données pour une meilleure lisibilité
    const formattedCommissions = commissions.map(commission => ({
      id: commission.id,
      amount: commission.amount,
      level: commission.level,
      status: commission.status,
      createdAt: commission.created_at,
      referredUser: commission.referral?.referred_user
    }));

    res.json({
      success: true,
      data: formattedCommissions,
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

// Générer un lien de parrainage
exports.generateReferralLink = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { customPath } = req.body;

    // Vérifier si l'utilisateur a déjà un code de parrainage
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('referral_code')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    let referralCode = user.referral_code;

    // Si l'utilisateur n'a pas de code de parrainage, en générer un nouveau
    if (!referralCode) {
      // Générer un code unique basé sur l'ID utilisateur
      referralCode = `REF${userId.replace(/[-]/g, '').substring(0, 8).toUpperCase()}`;
      
      // Mettre à jour le profil de l'utilisateur avec le nouveau code
      const { error: updateError } = await supabase
        .from('users')
        .update({ referral_code: referralCode })
        .eq('id', userId);

      if (updateError) throw updateError;
    }

    // Construire le lien de parrainage complet
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const referralPath = customPath || `r/${referralCode}`;
    const referralLink = `${baseUrl}/${referralPath}`;

    res.json({
      success: true,
      data: {
        referralCode,
        referralLink,
        qrCode: `${baseUrl}/api/referrals/qr?code=${encodeURIComponent(referralLink)}`
      }
    });
  } catch (error) {
    next(error);
  }
};

// Demander un retrait des commissions
exports.withdrawCommissions = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { amount, walletAddress, network = 'TRC20' } = req.body;

    // Vérifier le solde disponible
    const { data: balance, error: balanceError } = await supabase.rpc('get_referral_balance', {
      p_user_id: userId
    });

    if (balanceError) throw balanceError;

    if (balance.available_balance < amount) {
      throw createError(400, 'Insufficient referral balance');
    }

    // Créer une demande de retrait
    const { data: withdrawal, error: withdrawalError } = await supabase.rpc('create_referral_withdrawal', {
      p_user_id: userId,
      p_amount: amount,
      p_wallet_address: walletAddress,
      p_network: network
    });

    if (withdrawalError) throw withdrawalError;

    // Envoyer une notification
    await supabase
      .from('notifications')
      .insert([
        {
          user_id: userId,
          title: 'Withdrawal Request Submitted',
          message: `Your referral earnings withdrawal request of $${amount} has been received and is being processed.`,
          type: 'withdrawal',
          metadata: {
            withdrawal_id: withdrawal.id,
            amount: amount,
            wallet_address: walletAddress,
            network: network
          }
        }
      ]);

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawal
    });
  } catch (error) {
    next(error);
  }
};
