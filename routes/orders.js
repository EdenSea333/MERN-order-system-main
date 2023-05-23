const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const Order = require('../models/Order');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');

// @route   GET api/orders
// @desc    Get all users orders
// @access  Private
router.get('/', auth, async (req, res) => {
    let user = mongoose.Types.ObjectId(req.user.id);
    Order.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: 'serviceId',
                foreignField: '_id',
                as: 'productObj',
            },
        },
    ])
        .match({ customerId: { $eq: user } })
        .exec((err, ordersObj) => {
            if (err) {
                console.error(err.message);
                res.status(500).send('Server Error!');
            }
            else {
                res.json(ordersObj);
            }
        })
});

// @route   POST api/orders
// @desc    Save Orders
// @access  Public
router.post(
    '/',
    async (req, res) => {

        const { orders, userId, stripeToken } = req.body;
        console.log(orders)
        //--------------------------------------------------------------------------
        //Checkout using Stripe
        const stripe = require('stripe')('sk_test_seJqd8QYnsQHmnirLz6jCNpB00oTO3WNKh');
        const token = stripeToken; // Using Express

        (async () => {
            try {
                const charge = await stripe.charges.create({
                    amount: 9999,
                    currency: 'usd',
                    description: 'Example charge',
                    source: token,
                    statement_descriptor: 'Custom descriptor',
                });
                console.log(charge)
            }
            catch (err) {
                console.log(err);
                return;
            }
        })();
        //--------------------------------------------------------------------------

        try {
            const orderIds = []
            orders.forEach(element => {
                const order = new Order({
                    orderNo: element.orderNo,
                    serviceId: element.serviceId,
                    customerId: userId,
                    checkType: element.type,
                    subjectName: element.subjectName,
                    referenceId: element.referId,
                    country: element.country,
                    subjectNum: element.noSubject
                });
                order.save()
                orderIds.push(order.id)
            });
            //--------------------------------------------------------------------------
            //mailing using nodemailer
            const transporter = nodemailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 2525,
                auth: {
                    user: '9aac28145f422b',
                    pass: '197ffbfc85b808'
                }
            });

            const message = {
                from: 'elonmusk@tesla.com', // Sender address
                to: 'to@email.com',         // List of recipients
                subject: 'Design Your Model S | Tesla', // Subject line
                text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
            };

            transporter.sendMail(message, function (err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info);
                }
            });
            //--------------------------------------------------------------------------
            res.status(200).json(orderIds)
        } catch (err) {
            res.status(500).send('Server Error!');
        }
    });

module.exports = router;