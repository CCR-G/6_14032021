const express = require('express');

const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;