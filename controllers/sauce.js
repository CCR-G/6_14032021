const Sauce = require('../models/sauce');
const utils = require("./utils/sauce-utils");
const fs = require('fs');

exports.create = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOne = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.modify = (req, res) => {
    if (!req.file) {
        utils.updateSauce(req, res, req.body);
        return;
    }

    const sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                utils.updateSauce(req, res, sauceObject);
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.like = (req, res) => {
    const query = utils.getUpdateQueries(req.body.userId, req.body.like);

    Sauce.updateOne({ _id: req.params.id }, {
        _id: req.params.id,
        $push: query.push,
        $pull: query.pull,
    })
        .then(() => res.status(200).json({ message: 'Likes et dislikes des sauces mis à jour !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.delete = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAll = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};
