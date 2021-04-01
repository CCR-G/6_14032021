const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, "Le mot de passe doit contenir au minimum 8 caractères et contenir au moins une majuscule et une minuscule.", { 'content-type': 'application/json' });
        res.end('Format de mot de passe incorrect');
    } else {
        next();
    }
};