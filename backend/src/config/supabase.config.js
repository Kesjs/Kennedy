const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Vérification des variables d'environnement requises
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Variables d'environnement manquantes : ${missingVars.join(', ')}`);
}

// Création du client Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  }
);

module.exports = supabase;
