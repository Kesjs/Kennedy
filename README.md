# Gazoduc Invest

Plateforme d'investissement en GNL (Gaz Naturel Liquéfié) avec suivi de portefeuille, système de parrainage et tableau de bord complet.

## 🚀 Fonctionnalités principales

- **Authentification sécurisée** avec Supabase
- **Tableau de bord** avec aperçu des investissements
- **Gestion du portefeuille** avec historique des transactions
- **Système de parrainage** avec suivi des filleuls
- **Retraits et dépôts** sécurisés
- **Paramètres de sécurité** avancés (2FA, changement de mot de passe)
- **Interface utilisateur moderne** et réactive

## 🛠️ Technologies utilisées

### Frontend
- React 18
- Vite
- TailwindCSS
- React Query (TanStack Query)
- React Router
- Supabase (Authentification)
- React Icons

### Backend
- Node.js avec Express
- Supabase (Base de données et Auth)
- JWT pour l'authentification
- Winston pour la journalisation
- Helmet pour la sécurité

### Infrastructure
- Base de données PostgreSQL avec Supabase
- Stockage de fichiers avec Supabase Storage
- Hébergement scalable

## 🚀 Installation

### Prérequis
- Node.js 16+
- npm ou pnpm
- Compte Supabase

### Configuration du Backend

1. **Configuration de l'environnement**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Remplissez les variables d'environnement dans `.env` avec vos informations Supabase.

2. **Installation des dépendances**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```
   
   Le serveur démarrera sur `http://localhost:5001` par défaut.

### Configuration du Frontend

1. **Configuration de l'environnement**
   ```bash
   cd frontend
   cp .env.example .env
   ```
   
   Remplissez les variables d'environnement dans `.env` avec vos informations Supabase et l'URL de l'API.

### Commandes Git utiles

Pour effectuer une sauvegarde quotidienne de votre travail :

```bash
git add .; git commit -m "feat: sauvegarde quotidienne"; git push
```

Cette commande va :
1. Ajouter tous les fichiers modifiés
2. Créer un commit avec le message "feat: sauvegarde quotidienne"
3. Pousser les changements vers le dépôt distant

2. **Installation des dépendances**
   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Démarrer l'application**
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```
   
   L'application sera disponible sur `http://localhost:3002`

## 🚦 Guide d'utilisation

### Accès à l'application
1. **Page d'accueil** : Présentation des services et avantages
2. **Inscription/Connexion** : Créez un compte ou connectez-vous avec vos identifiants
3. **Tableau de bord** : Vue d'ensemble de votre portefeuille

### Fonctionnalités principales

#### 👤 Profil utilisateur
- Consultation et édition des informations personnelles
- Gestion des paramètres de sécurité
- Historique des transactions

#### 💰 Gestion des investissements
- Consultation des investissements en cours
- Historique des transactions
- Suivi des performances

#### 🤝 Parrainage
- Lien de parrainage personnel
- Suivi des filleuls
- Bénéfices de parrainage

#### ⚙️ Paramètres
- Modification du mot de passe
- Authentification à deux facteurs
- Préférences de notification

## 📊 Structure du projet

```
gazoduc-invest/
├── backend/               # Serveur API
│   ├── config/           # Configuration de la base de données
│   ├── controllers/      # Contrôleurs pour les routes API
│   ├── middleware/       # Middleware d'authentification
│   ├── routes/           # Définition des routes API
│   ├── utils/            # Utilitaires et helpers
│   ├── server.js         # Point d'entrée du serveur
│   └── package.json
│
├── frontend/             # Application React
│   ├── public/           # Fichiers statiques
│   └── src/
│       ├── assets/       # Images et polices
│       ├── components/   # Composants réutilisables
│       ├── context/      # Contextes React
│       ├── hooks/        # Hooks personnalisés
│       ├── pages/        # Pages de l'application
│       ├── services/     # Services API
│       ├── styles/       # Fichiers de style globaux
│       ├── App.jsx       # Composant racine
│       └── main.jsx      # Point d'entrée
│
├── supabase/             # Configuration Supabase
│   └── migrations/       # Migrations de base de données
│
└── README.md             # Ce fichier
```

## 🔒 Sécurité

- Authentification avec JWT et refresh tokens
- Protection contre les attaques CSRF et XSS
- Validation des entrées utilisateur
- Journalisation des activités sensibles
- Mots de passe hachés avec bcrypt
- Authentification à deux facteurs (2FA)

## 📈 Fonctionnalités avancées

### Système de parrainage
- Lien de parrainage personnel
- Suivi des filleuls et de leurs investissements
- Bonus de parrainage

### Gestion des investissements
- Suivi en temps réel des performances
- Historique des transactions
- Téléchargement des relevés

### Tableau de bord
- Graphiques de performance
- Statistiques détaillées
- Alertes personnalisables

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [Supabase](https://supabase.com/) pour l'authentification et la base de données
- [TailwindCSS](https://tailwindcss.com/) pour les styles
- [React Query](https://tanstack.com/query) pour la gestion des données

---

Développé avec ❤️ par l'équipe Gazoduc Invest
