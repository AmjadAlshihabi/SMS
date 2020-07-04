const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    firstname: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    address: {
        street: String,
        building: Number,
        zipcode: Number,
        city: String,
        country: String
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    }, 
})

module.exports = mongoose.model('User', userSchema);