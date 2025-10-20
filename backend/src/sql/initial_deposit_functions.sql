-- Fonction pour traiter un dépôt initial
CREATE OR REPLACE FUNCTION process_initial_deposit(
  p_user_id UUID,
  p_amount DECIMAL(10, 2),
  p_payment_method TEXT
) 
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  transaction_id UUID,
  new_balance DECIMAL(10, 2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_transaction_id UUID;
  v_new_balance DECIMAL(10, 2);
  v_has_deposit BOOLEAN;
BEGIN
  -- Vérifier si l'utilisateur a déjà effectué un dépôt initial
  SELECT has_initial_deposit INTO v_has_deposit
  FROM user_settings
  WHERE user_id = p_user_id;
  
  IF v_has_deposit THEN
    RETURN QUERY SELECT false, 'Un dépôt initial a déjà été effectué', NULL::UUID, NULL::DECIMAL;
    RETURN;
  END IF;
  
  -- Trouver ou créer le portefeuille de l'utilisateur
  INSERT INTO wallets (user_id, balance, currency, is_active)
  VALUES (p_user_id, 0, 'EUR', true)
  ON CONFLICT (user_id, currency) DO UPDATE
  SET is_active = true
  RETURNING id INTO v_wallet_id;
  
  IF v_wallet_id IS NULL THEN
    SELECT id INTO v_wallet_id
    FROM wallets
    WHERE user_id = p_user_id AND currency = 'EUR';
    
    IF v_wallet_id IS NULL THEN
      RETURN QUERY SELECT false, 'Erreur lors de la création du portefeuille', NULL::UUID, NULL::DECIMAL;
      RETURN;
    END IF;
  END IF;
  
  -- Créer la transaction de dépôt
  INSERT INTO transactions (
    user_id,
    wallet_id,
    amount,
    type,
    status,
    payment_method,
    description
  ) VALUES (
    p_user_id,
    v_wallet_id,
    p_amount,
    'deposit',
    'completed',
    p_payment_method,
    'Dépôt initial'
  )
  RETURNING id INTO v_transaction_id;
  
  -- Mettre à jour le solde du portefeuille
  UPDATE wallets
  SET balance = balance + p_amount,
      updated_at = NOW()
  WHERE id = v_wallet_id
  RETURNING balance INTO v_new_balance;
  
  -- Marquer que l'utilisateur a effectué un dépôt initial
  INSERT INTO user_settings (user_id, has_initial_deposit, updated_at)
  VALUES (p_user_id, true, NOW())
  ON CONFLICT (user_id) DO UPDATE
  SET has_initial_deposit = true,
      updated_at = NOW();
  
  -- Retourner le succès
  RETURN QUERY SELECT true, 'Dépôt initial effectué avec succès', v_transaction_id, v_new_balance;
  
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false, 'Erreur lors du traitement du dépôt: ' || SQLERRM, NULL::UUID, NULL::DECIMAL;
END;
$$;
