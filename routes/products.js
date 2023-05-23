const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   GET api/products
// @desc    Get all users products
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.find({}).sort({ name: '1' });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   POST api/products
// @desc    Add new product
// @access  Private
router.post('/', [auth, [
    check('name', 'Name is required.').not().isEmpty(),
    check('price', 'Price is required.').not().isEmpty(),
]], async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, country, description, level, dates } = req.body;

    try {
        const newProduct = new Product({
            name: name,
            price: price,
            description: description,
            country: country,
            serviceLevel: level,
            expectedDates: dates
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   PUT api/products/:id
// @desc    Update product
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, price, description } = req.body;
    // Build product object
    const productFields = {};

    if (name) productFields.name = name;
    if (price) productFields.price = price;
    if (description) productFields.description = description;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   DELETE api/products/:id
// @desc    Delete product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        await Product.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Product Removed!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

module.exports = router;