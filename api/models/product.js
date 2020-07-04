const mongoose = require('mongoose');

const product = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    category: {
        type: String,
        required: true,
        unique: true,
    },
    weight: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Product', product);