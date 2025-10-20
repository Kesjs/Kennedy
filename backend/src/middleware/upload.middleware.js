const multer = require('multer');
const { createError } = require('http-errors');

// Configuration de multer pour le stockage en mémoire
const storage = multer.memoryStorage();

// Filtre les types de fichiers
const fileFilter = (req, file, cb) => {
  // Vérifier le type MIME du fichier
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(createError(400, 'Only image files are allowed'), false);
  }
};

// Configuration de l'upload avec multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1 // 1 file per request
  },
  fileFilter: fileFilter
});

// Middleware pour gérer les erreurs de téléchargement
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Erreur liée à multer
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(createError(400, 'File size too large. Maximum 5MB allowed.'));
    }
    return next(createError(400, err.message));
  } else if (err) {
    // Autres erreurs
    return next(err);
  }
  next();
};

module.exports = {
  upload,
  handleUploadErrors
};
