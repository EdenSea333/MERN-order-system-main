const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Company = require('../models/Company');
const auth = require('../middleware/auth');

// @route   GET api/companies
// @desc    Get all users companies
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const companies = await Company.find({}).sort({ name: '1' });
        res.json(companies);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   POST api/companies
// @desc    Add new company
// @access  Private
router.post('/', [auth, [
    check('name', 'Name is required.').not().isEmpty(),
    // check('price', 'Price is required.').not().isEmpty(),
]], async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, country, contact, email, phone } = req.body;

    try {
        const newCompany = new Company({
            name: name,
            country: country,
            contact: contact,
            email: email,
            phone: phone
        });

        const company = await newCompany.save();
        res.json(company);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   PUT api/companies/:id
// @desc    Update company
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, country, contact, email, phone } = req.body;
    // Build company object
    const productFields = {};

    if (name) productFields.name = name;
    if (country) productFields.country = country;
    if (contact) productFields.contact = contact;
    if (email) productFields.email = email;
    if (phone) productFields.phone = phone;

    try {
        let company = await Company.findById(req.params.id);

        if (!company) return res.status(404).json({ msg: 'Company not found' });

        company = await Company.findByIdAndUpdate(
            req.params.id,
            { $set: productFields },
            { new: true }
        );

        res.json(company);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   DELETE api/companies/:id
// @desc    Delete company
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let company = await Company.findById(req.params.id);

        if (!company) return res.status(404).json({ msg: 'Company not found' });

        await Company.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Company Removed!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

module.exports = router;