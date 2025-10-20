// @ts-nocheck
// Shim pour @supabase/postgrest-js
// Ce fichier remplace les imports directs de @supabase/postgrest-js

// Exporter un objet avec des exports nommés
const PostgrestClient = class {
  constructor() {
    console.warn('PostgrestClient utilisé via shim - utilisez plutôt supabase.from()');
    return new Proxy({}, {
      get: () => () => ({
        data: null,
        error: new Error('PostgrestClient non disponible - utilisez supabase.from()')
      })
    });
  }
};

// Autres classes nécessaires
class PostgrestQueryBuilder {}
class PostgrestFilterBuilder {}
class PostgrestBuilder {}

// Classe d'erreur
class PostgrestError extends Error {
  constructor(message, details = null, hint = null, code = null) {
    super(message);
    this.name = 'PostgrestError';
    this.details = details;
    this.hint = hint;
    this.code = code;
  }
}

// Exporter tout comme des exports nommés
export {
  PostgrestClient,
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
  PostgrestBuilder,
  PostgrestError
};

// Note: Le client supabase doit être importé directement depuis './supabaseClient.js'
