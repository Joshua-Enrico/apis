/* eslint-disable no-unused-vars */
/* eslint-disable no-tabs */
/* eslint-disable indent */


/* eslint-disable new-cap */
const router = require('express').Router();
const {PrismaClient} = require('@prisma/client');

const {users} = new PrismaClient();

router.get('/', async (req, res) => {
  // pass
  await users.findMany({
		select: {
			name: true,
			email: true,
			lastName: true,
			firstName: true,
			age: true,
			id: true,
		},
	})
      .then((users) => {
        res.status(200).json(users);
      })
      .catch((err) => {
				console.log(err);
        res.status(500).json({error: err});
      });
});

router.post('/', async (req, res) => {
	let error = false;
	// arguments validation
	// validateargs(req.body, ['name', 'email', 'lastName', 'firstName', 'age']);
	await users.findMany({
		where: {
			OR: [
				{name: req.body.name},
				{email: req.body.email},
			],
		},
	}).then((user) => {
		console.log(user);
		if (user && user.length > 0) {
			error = true;
			return res.status(400).json({error: 'User or email already exists'});
		};
	}).catch((err) => {
		console.log(err);
		error = true;
		return res.status(500).json({error: 'Server error'});
	});

	if (!error) {
		await users.create({
			data: {
				name: req.body.name,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: req.body.password,
				age: req.body.age,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			select: {
				name: true,
				firstName: true,
				lastName: true,
				email: true,
				age: true,
				id: true,
			},
		}).then((user) => {
			return res.status(201).json(user);
		})
			.catch((err) => {
				console.log(err);
				return res.status(500).json({error: err});
			});
	}
});


router.get('/find/:id', async (req, res) => {
  // pass
  await users
    .findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    })
    .then((user) => {
			res.status(200).json(user);
		})
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({error: 'Server error, contact the administrator'});
    });
});

router.get('/search/:arg', async (req, res) => {
		await users.findMany({
			where: {
				OR: [
					{name: {contains: req.params.arg}},
					{email: {contains: req.params.arg}},
					{firstName: {contains: req.params.arg}},
					{lastName: {contains: req.params.arg}},
				],
			},
		}).then((users) => {
			console.log(users);
			return res.status(200).json(users);
		}).catch((err) => {
			console.log(err);
			return res.status(500).json('Server error');
		});
});


module.exports = router;
