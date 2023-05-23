const express = require('express');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
    console.log("reset password")
    console.log(req.params)
    console.log(req.body)
    User.findOne({
        where: {
            resetPasswordToken: req.params.resetPasswordToken,
            resetPasswordExpired: {
                $gt: Date.now()
            }
        }
        
    }).then( user=> {
        if(user == null) {
            console.log('password reset link is invalid')
            res.json('password reset link is invalid')
        } else {
            res.status(200).send({
                username: user.username,
                message: 'password reset link a-ok'
            })
        }
    });
});

module.exports = router;