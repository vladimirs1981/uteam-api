import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/user';
import { RegisterValidation } from '../validation/register.validation';

const allUsers = (req: Request, res: Response) => {
	User.findAll()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => console.log(err));
};

const registerUser = async (req: Request, res: Response) => {
	const salt = await bcrypt.genSalt(10);
	const body = req.body;
	const { error } = RegisterValidation.validate(body);
	if (error) {
		return res.status(400).send(error.details);
	}

	const user = {
		username: body.username,
		email: body.email,
		password: await bcrypt.hash(body.password, salt),
	};
	const userDoc = await User.findOne({
		where: {
			[Op.or]: [{ username: body.username }, { email: body.email }],
		},
	});
	if (userDoc) {
		return res.status(400).json({
			message: 'User already exists. ',
		});
	}
	const created_user = await User.create(user);
	res.status(201).json(created_user);
};

const loginUser = async (req: Request, res: Response) => {
	const { username, email } = req.body;
	const user = await User.findOne({
		where: {
			[Op.or]: [{ username: username || null }, { email: email || null }],
		},
	});
	if (user) {
		const password_valid = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (password_valid) {
			const token = jwt.sign(
				{ id: user.id, email: user.email, username: user.username },
				process.env.SECRET as string
			);
			res.status(200).json({ message: 'OK', token: token });
		} else {
			res.status(400).json({ error: 'Password incorrect' });
		}
	} else {
		res.status(404).json({ error: 'User does not exist' });
	}
};

export default {
	allUsers,
	registerUser,
	loginUser,
};
