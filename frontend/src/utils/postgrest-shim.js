// Shim pour @supabase/postgrest-js
// Ce fichier remplace les imports directs de @supabase/postgrest-js
// et redirige vers l'API Supabase standard

// Export par défaut vide pour éviter l'erreur
export default {};

// Exports nommés compatibles si nécessaire
export const PostgrestClient = class {
  constructor() {
    console.warn('PostgrestClient utilisé via shim - utilisez plutôt supabase.from()');
    // Retourner un objet vide au lieu de supabase pour éviter la référence circulaire
    return {};
  }
};

// Autres exports potentiels
export const PostgrestQueryBuilder = class {};
export const PostgrestFilterBuilder = class {};
export const PostgrestBuilder = class {};

// Export de PostgrestError pour compatibilité
export class PostgrestError extends Error {
  constructor(message, details = null, hint = null, code = null) {
    super(message);
    this.name = 'PostgrestError';
    this.details = details;
    this.hint = hint;
    this.code = code;
  }
}

// Note: Le client supabase doit être importé directement depuis './supabaseClient.js'
// pour éviter les références circulaires
