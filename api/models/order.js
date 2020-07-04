const mongoose = require('mongoose');

const order = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: [{
        // type: String,
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', 
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    customer: {
        name: {
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
        phonenumber: String,
        email: {
            type: String,
            required: true,
            // checks the form of the entered email.
            match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        },
    },
    orderDate: {
        type: Date,
        required: true
    },
    editor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    price: {
        type: Number,
        required: true
    }
    })

module.exports = mongoose.model('Order', order);