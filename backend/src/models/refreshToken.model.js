const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false }
});

// Index pour la recherche par token et par utilisateur
refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1 });

// Suppression automatique des tokens expirés tous les jours
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
