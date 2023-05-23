const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Fee = require('../models/Fee');
const auth = require('../middleware/auth');

// @route   GET api/fees
// @desc    Get all users fees
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const fees = await Fee.find({}).sort({ productId: '1' });
        res.json(fees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   POST api/fees
// @desc    Add new fee
// @access  Private
router.post('/', [auth, [
    // check('name', 'Name is required.').not().isEmpty(),
    // check('price', 'Price is required.').not().isEmpty(),
]], async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newFee = new Fee({
            productId: req.body.productId,
            country: req.body.country,
            fee: req.body.fee
        });

        const fee = await newFee.save();
        res.json(fee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   PUT api/fees/:id
// @desc    Update fee
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { productId, country, fee } = req.body;
    // Build fee object
    const feeFields = {};

    if (productId) feeFields.productId = productId;
    if (country) feeFields.country = country;
    if (fee) feeFields.fee = fee;

    try {
        let fee = await Fee.findById(req.params.id);

        if (!fee) return res.status(404).json({ msg: 'Fee not found' });

        fee = await Fee.findByIdAndUpdate(
            req.params.id,
            { $set: feeFields },
            { new: true }
        );

        res.json(fee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   DELETE api/fees/:id
// @desc    Delete fee
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let fee = await Fee.findById(req.params.id);

        if (!fee) return res.status(404).json({ msg: 'Fee not found' });

        await Fee.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Fee Removed!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

module.exports = router;