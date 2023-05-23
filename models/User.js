const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    companyId: {
        // type: Schema.Types.ObjectId,
        // ref: 'companies',
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'customer'
    },
    resetPasswordToken: {
        type: String,
        default: ''
    },
    resetPasswordExpired: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('user', UserSchema);