const { User } = require('../../models');
const { validateArgs } = require('./validations/createArgs');
const router = require('express').Router();
var CryptoJS = require("crypto-js");// for encrypting passwords
const { verifyToken } = require('../auth/utils/verifyToken');
require('dotenv').config();

// Crear usuario
router.post("/", async (req, res) => {
  const args = req.body;
  let error = false;

  const result = validateArgs({
    name: args.name,
    email: args.email,
    firstName: args.firstName,
    lastName: args.lastName,
    password: args.password,
    age: args.age,
  });

  if (!result.isValid) {
    return res.status(400).json({ error: result.message });
  }

  await User.find({
    $or: [{ name: args.name }, { email: args.email }],
  })
    .then((users) => {
      if (users.length > 0) {
        error = true;
        return res.status(400).json({ error: "name or email already used" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: "Server error", error: err });
    });

  if (!error) {
    await User.create({
      name: args.name,
      email: args.email,
      firstName: args.firstName,
      lastName: args.lastName,
      password: CryptoJS.AES.encrypt(args.password, process.env.SECRET_KEY).toString(),
      age: args.age,
    })
      .then((user) => {
        const { name, email, firstName, lastName, age, _id } = user;
        res.status(200).json({ name, email, firstName, lastName, age, _id });
      })
      .catch((err) => {
        res.status(500).json({ message: "Server error", error: err });
      });
  }
});

// obtener todos los usuarios
router.get('/',verifyToken, async (req, res) => {

  await User.find({}, 'name email firstName lastName age _id')
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Server error",
        error: err
      });
    });

})

// usuario por id
router.get('/:id', async (req, res) => {
  if(req.params.id === undefined || req.params.id === null){
    return res.status(400).json({ error: "id is required"})
  }

  await User.findById(req.params.id, 'name email firstName lastName age _id')
  .then((user) => {
    return res.status(200).json(user);
  })
  .catch((err) => {
    return res.status(500).json({ message: "Server error", error: err });
  });
})

// search users
router.get('/search/:arg', async(req, res) => {
  await User.find({
    $or: [
      { name: { $regex: req.params.arg, $options: 'i' } },
      { email: { $regex: req.params.arg, $options: 'i' } },
      { firstName: { $regex: req.params.arg, $options: 'i' } },
      { lastName: { $regex: req.params.arg, $options: 'i' } },
    ]
  }, 'name email firstName lastName age _id')
  .then((users) => {
    return res.status(200).json(users);
  })
  .catch((err) => {
    return res.status(500).json({ message: "Server error", error: err });
  })


})

module.exports = router;