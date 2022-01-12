import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from '../models/user';
import signJWT from '../functions/signJWT';
import Profile from '../models/profile';

const validateToken: RequestHandler = (req, res) => {
	console.log('Token validated, user authorized.');

	return res.status(200).json({ message: 'Authorized.' });
};

const getUsers: RequestHandler = async (req, res) => {
	try {
		const users = await User.findAll({
			attributes: { exclude: ['password'] },
			where: {},
		});
		return res.status(200).json({ users: users });
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read users.' });
	}
};

const getUser: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findOne({
			attributes: { exclude: ['password'] },
			include: [
				{
					model: Profile,
					attributes: ['status', 'name', 'profilePhoto'],
				},
			],
			where: { id },
		});
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

const registerUser: RequestHandler = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const user = {
			username: req.body.username,
			email: req.body.email,
			password: await bcrypt.hash(req.body.password, salt),
		};
		const userDoc = await User.findOne({
			where: {
				[Op.or]: [{ username: req.body.username }, { email: req.body.email }],
			},
		});
		if (userDoc) {
			return res.status(400).json({
				message: 'User already exists. ',
			});
		}
		const created_user = await User.create(user);
		res.status(201).json(created_user);
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

const loginUser: RequestHandler = async (req, res) => {
	try {
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
				signJWT(user, (_error, token) => {
					if (_error) {
						return res.status(401).json({
							message: 'Unable to sign token',
							error: _error,
						});
					} else if (token) {
						return res.status(200).json({
							message: 'OK',
							token,
						});
					}
				});
			} else {
				res.status(400).json({ error: 'Password incorrect' });
			}
		} else {
			res.status(404).json({ error: 'User does not exist' });
		}
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

export default {
	validateToken,
	getUsers,
	getUser,
	registerUser,
	loginUser,
};
