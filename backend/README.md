# Gazoduc Invest - API Backend

Ce dépôt contient le backend de l'application Gazoduc Invest, une plateforme d'investissement avec système de parrainage.

## Fonctionnalités

- **Authentification** : Inscription, connexion, gestion de profil
- **Investissements** : Gestion des réservoirs d'investissement, calcul des bénéfices
- **Transactions** : Dépôts, retraits, historique
- **Parrainage** : Système de parrainage à plusieurs niveaux, commissions
- **Administration** : Gestion des utilisateurs, des transactions, etc.

## Prérequis

- Node.js (v14 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- Compte Supabase
- Compte de service pour les paiements (optionnel)

## Configuration

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/gazoduc-invest.git
   cd gazoduc-invest/backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :
   ```env
   # Configuration du serveur
   PORT=5000
   NODE_ENV=development
   
   # Base de données Supabase
   SUPABASE_URL=votre_url_supabase
   SUPABASE_ANON_KEY=votre_anon_key
   SUPABASE_SERVICE_KEY=votre_service_key
   
   # JWT
   JWT_SECRET=votre_secret_jwt
   JWT_EXPIRES_IN=7d
   
   # URL du frontend
   FRONTEND_URL=http://localhost:3000
   
   # Configuration des e-mails (optionnel)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=user@example.com
   SMTP_PASS=votre_mot_de_passe
   
   # Configuration des paiements (optionnel)
   PAYMENT_PROVIDER=stripe
   STRIPE_SECRET_KEY=votre_cle_stripe
   ```

## Initialisation de la base de données

1. Créez une nouvelle base de données PostgreSQL
2. Exécutez le script SQL fourni dans `database/schema.sql`
3. Exécutez les migrations :
   ```bash
   npx knex migrate:latest
   ```

## Démarrage du serveur

En mode développement :
```bash
npm run dev
```

En production :
```bash
npm start
```

## Tests

Pour exécuter les tests :
```bash
npm test
```

## Documentation de l'API

La documentation complète de l'API est disponible à l'adresse :
`http://localhost:5000/api-docs` (en mode développement)

## Structure du projet

```
backend/
├── src/
│   ├── config/           # Configuration de l'application
│   ├── controllers/      # Contrôleurs pour les routes API
│   ├── middleware/       # Middleware personnalisés
│   ├── models/           # Modèles de données
│   ├── routes/           # Définition des routes
│   ├── services/         # Logique métier
│   ├── utils/            # Utilitaires
│   ├── app.js            # Configuration d'Express
│   └── server.js         # Point d'entrée du serveur
├── database/
│   ├── migrations/       # Fichiers de migration
│   ├── seeds/            # Données de test
│   └── schema.sql        # Schéma de la base de données
├── tests/                # Tests unitaires et d'intégration
├── .env                  # Variables d'environnement
├── .gitignore
├── package.json
└── README.md
```

## Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| PORT | Port sur lequel le serveur écoute | 5000 |
| NODE_ENV | Environnement d'exécution | development |
| SUPABASE_URL | URL de votre instance Supabase | - |
| SUPABASE_ANON_KEY | Clé anonyme Supabase | - |
| SUPABASE_SERVICE_KEY | Clé de service Supabase | - |
| JWT_SECRET | Clé secrète pour les JWT | - |
| JWT_EXPIRES_IN | Durée de validité des tokens JWT | 7d |
| FRONTEND_URL | URL du frontend | http://localhost:3000 |

## Endpoints principaux

### Authentification

- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil de l'utilisateur connecté

### Utilisateurs

- `GET /api/users/me` - Profil de l'utilisateur connecté
- `PUT /api/users/profile` - Mettre à jour le profil
- `POST /api/users/change-password` - Changer le mot de passe
- `POST /api/users/upload-avatar` - Télécharger une photo de profil

### Investissements

- `GET /api/investments/reservoirs` - Liste des réservoirs disponibles
- `POST /api/investments` - Créer un nouvel investissement
- `GET /api/investments` - Liste des investissements de l'utilisateur
- `GET /api/investments/:id` - Détails d'un investissement
- `POST /api/investments/:id/withdraw-profit` - Retirer les bénéfices

### Transactions

- `GET /api/transactions` - Historique des transactions
- `GET /api/transactions/:id` - Détails d'une transaction
- `POST /api/transactions/withdraw` - Demander un retrait
- `POST /api/transactions/:id/cancel` - Annuler une demande de retrait

### Parrainage

- `GET /api/referrals/stats` - Statistiques de parrainage
- `GET /api/referrals/list` - Liste des filleuls
- `GET /api/referrals/commissions` - Historique des commissions
- `POST /api/referrals/generate-link` - Générer un lien de parrainage
- `POST /api/referrals/withdraw` - Retirer des commissions
- `GET /api/referrals/verify/:code` - Vérifier un code de parrainage

## Sécurité

- Toutes les routes (sauf `/api/auth/*` et `/api/referrals/verify/*`) nécessitent un jeton JWT valide
- Les mots de passe sont hachés avec bcrypt
- Protection contre les attaques CSRF
- Taux de requêtes limité pour éviter les abus

## Déploiement

### Avec PM2 (recommandé pour la production)

1. Installez PM2 globalement :
   ```bash
   npm install -g pm2
   ```

2. Démarrez l'application avec PM2 :
   ```bash
   pm2 start npm --name "gazoduc-invest" -- start
   ```

3. Pour le redémarrage automatique au démarrage du serveur :
   ```bash
   pm2 startup
   pm2 save
   ```

### Avec Docker

1. Créez un fichier `docker-compose.yml` :
   ```yaml
   version: '3'
   
   services:
     app:
       build: .
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - PORT=5000
         - SUPABASE_URL=${SUPABASE_URL}
         - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
         - JWT_SECRET=${JWT_SECRET}
         - FRONTEND_URL=${FRONTEND_URL}
       restart: unless-stopped
   ```

2. Construisez et démarrez les conteneurs :
   ```bash
   docker-compose up -d
   ```

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub ou contacter l'équipe de support à support@gazoduc-invest.com.
