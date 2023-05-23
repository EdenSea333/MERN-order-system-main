const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeeSchema = mongoose.Schema({
    productId: {
        // type: Schema.Types.ObjectId,
        // ref: 'products',
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    fee: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('fee', FeeSchema);