const express = require('express');
const rateLimit = require("express-rate-limit");
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordVerification = require('../middleware/password-verification');

router.post('/signup', passwordVerification, userCtrl.signup);
router.post('/login', rateLimit({ max: 3 }), userCtrl.login);

module.exports = router;