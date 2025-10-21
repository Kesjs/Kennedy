const http = require('http');
const httpProxy = require('http-proxy');

// Créer une instance de proxy
const proxy = httpProxy.createProxyServer({});

// Récupérer l'adresse IP de votre machine
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let localIp = '0.0.0.0'; // Écouter sur toutes les interfaces par défaut

// Trouver l'adresse IPv4 non interne
Object.keys(networkInterfaces).forEach(iface => {
  networkInterfaces[iface].forEach(details => {
    if (details.family === 'IPv4' && !details.internal) {
      localIp = details.address;
    }
  });
});

const server = http.createServer((req, res) => {
  console.log(`Requête reçue pour: ${req.url}`);
  
  // Gestion des pré-requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': 86400
    });
    return res.end();
  }
  
  // Configuration des en-têtes CORS pour toutes les réponses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.url.startsWith('/api')) {
    console.log('Redirection vers le backend');
    proxy.web(req, res, { 
      target: 'http://localhost:5001',
      changeOrigin: true
    });
  } else {
    console.log('Redirection vers le frontend');
    proxy.web(req, res, { 
      target: 'http://localhost:3002',
      changeOrigin: true
    });
  }
});

// Gestion des erreurs
proxy.on('error', (err, req, res) => {
  console.error('Erreur de proxy:', err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Erreur de proxy: ' + err.message);
});

const PORT = 8080;
const HOST = '0.0.0.0'; // Écouter sur toutes les interfaces
server.listen(PORT, HOST, () => {
  console.log(`Serveur proxy démarré sur http://${localIp}:${PORT}`);
  console.log('Routes:');
  console.log(`- Frontend: http://${localIp}:${PORT}`);
  console.log(`- API: http://${localIp}:${PORT}/api`);
  console.log('\nUtilisez maintenant ngrok avec:');
  console.log(`ngrok http ${PORT}`);
});