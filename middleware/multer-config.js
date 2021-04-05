const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

const filter = (req, file, callback) => {
    if (!MIME_TYPES[file.mimetype]) {
        callback(new Error('Only images are allowed'), false);
        return;
    }
    callback(null, true);
};

const multer_options = {
    storage: storage,
    limits: { fileSize: 100000 },
    fileFilter: filter,
};

module.exports = multer(multer_options).single('image');