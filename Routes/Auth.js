const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route     POST routes/register
//@desc      Register User
//@access    Private just for admin Role

router.post(
    '/register',
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Lütfen geçerli bir e-mail girin.').isEmail(),
        check(
            'password',
            'Lürfen şifrenizi en az 6 karakter olacak şekilde girin'
        ).isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        //See if the user exists
        const { name, email, password, userRole } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res
                    .status(400)
                    .json({ response: false, msg: 'Email already is taken' });
            }

            user = new User({
                name,
                email,
                password,
                userRole
            });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            res.json({ msg: 'Register is succesful' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


//@route     POST api/login
//@desc      Login User and get Token
//@access    Public

router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        //See if the user exists
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res
                    .status(400)
                    .json({ response: false, msg: 'User not found!' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ response: false, msg: 'Password is wrong!' });
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 36000 },
                (err, token) => {
                    if (err) {
                        throw err;
                    }
                    res.json({ userRole: user.userRole, token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);



module.exports = router;