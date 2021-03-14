const express = require('express');

const saucesRoutes = require('./routes/sauce');

const app = express();

app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

app.use('/api/sauces', saucesRoutes);

module.exports = app;