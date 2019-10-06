const express = require('express');
const router = express.Router();
const passport = require('passport');
const keys = require('../config/keys');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({success: false, msg: 'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User Registered'});
        }
    })
});

// Authenticate
router.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: 'User not found'});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const payload = {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                };
                // Sign Token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {expiresIn: 3600}, // 1 hour
                    (err, token) => {
                        res.json({
                            success: true,
                            user: payload,
                            token: 'Bearer ' + token
                        })
                    });
            } else {
                return res.json({success: false, msg: 'Password incorrect'});
            }
        })
    })
});


// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.json({user: req.user});
    });

// Validate
router.get('/validate', (req, res, next) => {
    res.send('VALIDATE')
});


module.exports = router;
