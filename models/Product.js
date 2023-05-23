const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    serviceLevel: {
        type: Number,
        required: true,
    },
    expectedDates: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('product', ProductSchema);