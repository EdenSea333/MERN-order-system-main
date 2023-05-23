const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    orderNo: {
        type: String,
        required: true
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    partnerId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: false
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'pending'
    },
    deliveryStatus: {
        type: String,
        required: true,
        default: 'pending'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    checkType: {
        type: String,
        required: true
    },
    subjectName: {
        type: String,
        required: false
    },
    referenceId: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: true
    },
    subjectNum: {
        type: String,
        required: false
    }
});

module.exports = Order = mongoose.model('order', OrderSchema);