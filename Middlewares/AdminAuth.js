const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    //Get Token from header
    const token = req.header('x-auth-token');
    //Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'There is no valid token' });
    }

    //Verify Token,

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        const user = await User.findById(req.user.id).select('-password');

        if (user) {
            next();
        } else {
            res.status(400).json({ msg: 'You have no permission!' });
        }

    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: 'Please try again' });
    }
};