const express = require('express');
const router = express.Router();
// const bcrypt = require('bcryptjs');
// const config = require('config');
const {
    check,
    validationResult
} = require('express-validator');
// const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post(
    '/',
    [
        check('email', 'Please include a valid email').isEmail()
    ],
    async (req, res) => {
        console.log(req.body)
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const { email } = req.body;

        try {
            let user = await User.findOne({
                email
            });

            if (!user) {
                return res.status(400).json({
                    msg: 'User does not exist.'
                });
            } else {
                const token = crypto.randomBytes(20).toString('hex')
                user.resetPasswordToken = token
                user.resetPasswordExpired = Date.now() + 3600000
                user.save()
                console.log(user)

                // nodemail
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'chenming.biz@gmail.com',
                        pass: 'chenming!111'
                    }
                });

                var mailOptions = {
                    from: 'chenming.biz@gmail.com',
                    to: 'meiliangjie25@gmail.com',
                    subject: 'Link To Reset Password',
                    text: 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' + 
                    'http:localhost:3000/reset/${token}\n\n' + 
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                //
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error!');
        }
    });

module.exports = router;