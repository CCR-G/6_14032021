const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {
    const user_email = req.body.email;
    user_email = user_email.toLowerCase();
    if (!isEmailValid(user_email)) {
        return res.status(400).send({ message: "Email is invalid" })
    }

    createSecureUser(user_email, req.body.password)
        .then(user => {
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

async function createSecureUser(email, password, salt = 10) {
    const hashed_password = await bcrypt.hash(password, salt);
    return new User({
        email: email,
        password: hashed_password
    });
}

function isEmailValid(email) {
    const mail_regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return mail_regex.test(email);
}

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
                    const token = getToken(user);
                    res.status(200).json(token);
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

function getToken(user) {
    return {
        userId: user._id,
        token: jwt.sign(
            { userId: user._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '1h' }
        )
    }
}