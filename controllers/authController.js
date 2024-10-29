const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

exports.getLogin = (req, res) => {
    res.render('login', { errorMessages: [], successMessage: null });
};

exports.postLogin = [
    body('username').notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
    
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.render('login', { errorMessages, successMessage: null });
        }

        const { username, password } = req.body;
        User.findByUsername(username, (err, user) => {
            if (err) {
                return res.render('login', { errorMessages: ["Error fetching user"], successMessage: null });
            }
            if (!user) {
                return res.render('login', { errorMessages: ["User not found"], successMessage: null });
            }

            User.verifyPassword(password, user.password, (err, match) => {
                if (err) {
                    return res.render('login', { errorMessages: ["Error verifying password"], successMessage: null });
                }

                if (match) {
                    req.session.user = user;
                    return res.redirect('/admin');
                }

                return res.render('login', { errorMessages: ["Incorrect password"], successMessage: null });
            });
        });
    }
];

exports.getRegister = (req, res) => {
    res.render('register', { errorMessages: [], successMessage: null });
};

exports.postRegister = [
    body('email').isEmail().withMessage('Invalid email format.'),
    body('username').notEmpty().withMessage('Username is required.'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number.')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter.'),
    
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(error => error.msg);
            return res.render('register', { errorMessages, successMessage: null });
        }

        const { email, username, password } = req.body;

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.render('register', { errorMessages: [`Error hashing password: ${err}`], successMessage: null });
            }

            User.createUser(email, username, hash, (err) => {
                if (err) {
                    return res.render('register', { errorMessages: [`Error registering user: ${err}`], successMessage: null });
                }
                return res.render('login', { errorMessages: null, successMessage: "Registration successful! You can log in now." });
            });
        });
    }
];