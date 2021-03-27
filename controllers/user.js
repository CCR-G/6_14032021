const User = require('../models/user');
const utils = require('./utils/user-utils');
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
    let user_email = req.body.email;
    user_email = user_email.toLowerCase();
    if (!utils.isEmailValid(user_email)) {
        return res.status(400).send({ message: "Email is invalid" })
    }

    utils.createSecureUser(user_email, req.body.password)
        .then(user => {
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res) => {
    const user_email = req.body.email;
    User.findOne({ email: user_email.toLowerCase() })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    const token = utils.getToken(user);
                    res.status(200).json(token);
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
