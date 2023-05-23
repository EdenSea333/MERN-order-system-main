const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
    console.log(req.user.id)
    try {
        // const contacts = await User.find({ user: req.user.id }).sort({ date: '-1' });
        const contacts = await User.find().sort({ name: '1' });
        console.log(contacts)
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post('/', [auth, [
    check('name', 'Name is required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { company, name, country, email, phone, role, password } = req.body;

    try {
        const newContact = new User({
            companyId: company,
            name: name,
            country: country,
            email: email,
            phone: phone,
            role: role,
            password: password
        });
        const salt = await bcrypt.genSalt(10);
        newContact.password = await bcrypt.hash(password, salt);

        const contact = await newContact.save();
        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
    console.log(req.body)
    const { company, name, country, email, phone, role } = req.body;

    // Build contact object
    const contactFields = {};

    if (company) contactFields.companyId = company;
    if (name) contactFields.name = name;
    if (country) contactFields.country = country;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (role) contactFields.role = role;

    try {
        let contact = await User.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'User not found' });

        contact = await User.findByIdAndUpdate(
            req.params.id,
            { $set: contactFields },
            { new: true }
        );

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let contact = await User.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'User not found' });

        // Make sure user owns contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await User.findByIdAndRemove(req.params.id);

        res.json({ msg: 'User Removed!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error!');
    }
});

module.exports = router;