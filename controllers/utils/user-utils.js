const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    createSecureUser: async function (email, password, salt = 10) {
        const hashed_password = await bcrypt.hash(password, salt);
        return new User({
            email: email,
            password: hashed_password
        });
    },

    isEmailValid: (email) => {
        const mail_regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return mail_regex.test(email);
    },

    getToken: (user) => {
        return {
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                process.env.TOKEN_SECRET_KEY,
                { expiresIn: '1h' }
            )
        }
    }
}