const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const AdminAuth = require('../Middlewares/AdminAuth');



//@route     POST /records
//@desc      Login User and get Token
//@access    Private just for admin Role

router.post( '/createRecord', AdminAuth ,async (req, res) => {
    const { name, email, ssnumber,birthDate } = req.body;

    try {
        let record = await Record.findOne({ ssnumber });
        if (record) {
            return res
                .status(400)
                .json({ response: false, msg: 'Bu kişi eklenmiş' });
        }

        console.log(birthDate)
        record = new Record({
            name,
            email,
            ssnumber,
            birthDate
        });

        await record.save();
        res.json({ msg: 'Register is succesful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

//@route     GET /records
//@desc      Get all records
//@access    Private just for admin Role




module.exports = router;