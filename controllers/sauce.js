const Sauce = require('../models/sauce');
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
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.like = (req, res) => {
    const like = req.body.like;
    const userId = req.body.userId;

    let push_query = {};
    let pull_query = {};

    switch (like) {
        case -1:
            push_query = { usersDisliked: userId };
            pull_query = { usersLiked: userId };
            break;
        case 0:
            pull_query = { usersLiked: userId, usersDisliked: userId };
            break;
        case 1:
            push_query = { usersLiked: userId };
            pull_query = { usersDisliked: userId };
            break;
        default:
            throw new Error("like should be either 1, 0 or -1");
    }

    Sauce.updateOne({ _id: req.params.id }, {
        _id: req.params.id,
        $push: push_query,
        $pull: pull_query,
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
