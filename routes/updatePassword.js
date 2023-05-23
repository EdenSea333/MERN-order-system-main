const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/',[
    check('email', 'Please include a valid email').isEmail() 
], async (req, res) => {
    const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    
    console.log(req )
    console.log(req.param )
    console.log(req.body )
    
    User.findOne({
        where: {
            email: req.body.email 
        }
        
    }).then( user=> {
        if(user === null) {
            console.log('password reset link is invalid')
            res.status(404).json('password reset is invalid')
        } else {
            const salt = bcrypt.genSalt(10);
            bcrypt
                .hash(req.body.password, salt)
                .then( hashedPassword => {
                    user.update({
                        password: hashedPassword,
                        resetPasswordToken: null,
                        resetPasswordExpired: null
                    })
                    
                })
                .then(() => {
                    res.status(200).send({
                        username: user.username,
                        message: 'password reset link a-ok'
                    })
                })
        }
    });
});

module.exports = router;