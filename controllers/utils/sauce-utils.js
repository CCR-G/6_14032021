const Sauce = require('../../models/sauce');
const fs = require('fs');

module.exports = {
    updateSauce: (req, res, sauceObject) => {
        Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
        )
            .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
            .catch(error => res.status(400).json({ error }));
    },

    deleteFile: (image_url, callback) => {
        const filename = image_url.split('/images/')[1];
        fs.unlink(`images/${filename}`, callback);
    },

    getUpdateQueries: (user_id, like) => {
        let push_query = {};
        let pull_query = {};

        switch (like) {
            case -1:
                push_query = { usersDisliked: user_id };
                pull_query = { usersLiked: user_id };
                break;
            case 0:
                pull_query = { usersLiked: user_id, usersDisliked: user_id };
                break;
            case 1:
                push_query = { usersLiked: user_id };
                pull_query = { usersDisliked: user_id };
                break;
            default:
                throw new Error("like should be either 1, 0 or -1");
        }

        return { push: push_query, pull: pull_query };
    },

}
