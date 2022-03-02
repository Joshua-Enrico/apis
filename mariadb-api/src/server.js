const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const userEnpoints = require('./routes/user');

// express init
const api = express();

// configs
api.use(express.json());
api.use(cors());

// test
api.get('/api/test', (req, res) => {
  res.send({message: 'test ok !'});
});

// Endpoints
api.use('/api/user', userEnpoints);


// Port config
api.listen(process.env.PORT || 5000, () => {
  console.log(`Server Running on port ${process.env.PORT || 5000}`);
});
