// Shim pour @supabase/node-fetch
// Ce fichier remplace les imports de @supabase/node-fetch
// et utilise l'API fetch native du navigateur

// Fonction fetch native
const nativeFetch = globalThis.fetch || window.fetch;

// Exports nommés pour compatibilité avec node-fetch
export const fetch = nativeFetch;
export const Headers = globalThis.Headers || window.Headers;
export const Request = globalThis.Request || window.Request;
export const Response = globalThis.Response || window.Response;
export const FormData = globalThis.FormData || window.FormData;
export const AbortController = globalThis.AbortController || window.AbortController;
export const AbortSignal = globalThis.AbortSignal || window.AbortSignal;

// Polyfills pour d'autres exports potentiels
export const Blob = globalThis.Blob || window.Blob;
export const File = globalThis.File || window.File;
export const URLSearchParams = globalThis.URLSearchParams || window.URLSearchParams;

// Export par défaut unique
export default nativeFetch;
