/**
 * Formate un montant en fonction de la devise
 * @param {number} amount - Le montant à formater
 * @param {string} currency - Le code de la devise (par défaut: 'EUR')
 * @returns {string} Le montant formaté
 */
export const formatCurrency = (amount, currency = 'EUR') => {
  if (amount === null || amount === undefined || amount === '') {
    return '0,00';
  }

  // S'assurer que amount est un nombre
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Vérifier si le nombre est valide
  if (isNaN(numAmount)) {
    console.error('Montant invalide:', amount);
    return '0,00';
  }

  // Formater le nombre avec l'espace comme séparateur de milliers
  // et la virgule comme séparateur décimal
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
};

export const formatNumber = (number, decimals = 2, locale = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

export const formatPercentage = (value, decimals = 2, locale = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};
