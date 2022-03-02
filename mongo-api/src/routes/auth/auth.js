const { User } = require('../../models');
const router = require('express').Router();
const CryptoJS = require("crypto-js");// for encrypting passwords
const jwt = require('jsonwebtoken');// for creating tokens
require('dotenv').config();// loads env variables


// login , autenticate conection
router.get('/', async (req, res) => {

    const args = req.body;

    if ((!args.email || !args.password) || (args.email === "" || args.password === "")) {
        return res.status(400).json({
            error: "Missing or Wrong arguments"
        });
    }
    await User.find({
            $and: [{
                    email: args.email
                },


            ]
        }, 'name email firstName lastName age _id password')
        .then((user) => {
            if (user.length === 0 || user === null) {
                return res.status(404).json({
                    error: "Wrong email or password"
                });
            }
            const decrypted = CryptoJS.AES.decrypt(user[0].password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
            if (decrypted !== args.password) {
                return res.status(404).json({
                    error: "Wrong email or password"
                });
            }

            const token = jwt.sign({
                id: user[0]._id,
            }, process.env.SECRET_KEY, {
                expiresIn: '7d'
            });
            const {
                name,
                email,
                firstName,
                lastName,
                age,
                _id
            } = user[0];
            return res.status(200).json({
                user: {
                    name,
                    email,
                    firstName,
                    lastName,
                    age,
                    _id
                },
                token
            });
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Server error",
                error: err
            });
        })

})

module.exports = router;
