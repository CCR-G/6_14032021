const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)
    .has().uppercase()
    .has().lowercase()
    .has().digits()

module.exports = passwordSchema;