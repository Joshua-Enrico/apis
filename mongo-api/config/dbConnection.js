const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const MongoDB = async () => {
    console.log('Connecting to Database...');
    await mongoose.connect(process.env.DBPATH)
    .then(() => {
        console.log('Connected to Database');
    }).catch(err => {
        console.log(err);
    })
}

module.exports = { MongoDB };