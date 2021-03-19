const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    usersLiked: { type: [this.userId], required: true },
    usersDisliked: { type: [this.userId], required: true }
}, { toJSON: { virtuals: true } });

sauceSchema.virtual('likes').get(function () { return this.usersLiked.length });
sauceSchema.virtual('dislikes').get(function () { return this.usersDisliked.length })

module.exports = mongoose.model('Sauce', sauceSchema);