const express = require('express');
require('dotenv').config();
const cors = require('cors');// enable cors
const { MongoDB } = require('../config/dbConnection');
const userEndoints = require('./routes/user/user');
const authEndpoints = require('./routes/auth/auth');

MongoDB();
const api = express();// create express app
api.use(express.json());// parse json
api.use(cors());// enable cors

//Endpoints
api.use('/api/user', userEndoints);// add user endpoints'
api.use('/api/auth', authEndpoints);// add auth endpoints'

//Start server
api.listen(process.env.PORT || 5000 , () =>
    {
        console.log(`Server is running on port ${process.env.PORT || 5000}`);
    }
);// listen on port 5000