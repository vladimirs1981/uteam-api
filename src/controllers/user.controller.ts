import { RequestHandler, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from '../models/user.model';
import { createToken, createCookie } from '../functions/signJWT';
import Profile from '../models/profile.model';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import { UserCreationAttributes } from '../interfaces/user.model.interface';
import { TokenData } from '../interfaces/token.interface';

const getUsers: RequestHandler = async (req, res) => {
	const { page, size } = req.query;

	try {
		const users = await User.findAndCountAll({
			attributes: { exclude: ['password'] },
			include: {
				model: Profile,
				attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
			},
			limit: +size,
			offset: (+page - 1) * +size,
			where: {},
		});

		const pages = Math.ceil(users.count / +size);

		return res.status(200).send({
			result: users,
			pages: pages,
			'current page': +page,
		});
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read users.' });
	}
};

const getUser: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const user: User = await User.findOne({
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
		const user: UserCreationAttributes = {
			username: req.body.username,
			email: req.body.email,
			role: req.body.role,
			password: await bcrypt.hash(req.body.password, salt),
		};
		const userDoc: User = await User.findOne({
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
		const tokenData: TokenData = createToken(created_user);
		res.setHeader('Set-Cookie', [createCookie(tokenData)]);
		res.status(201).json(created_user);
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

const loginUser: RequestHandler = async (req, res) => {
	try {
		const { username, email } = req.body;
		const user: User = await User.findOne({
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
				const tokenData: TokenData = createToken(user);
				res.setHeader('Set-Cookie', [createCookie(tokenData)]);
				return res.status(200).json({
					message: 'OK',
					token: tokenData.token,
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

const logoutUser = async (req: RequestWithUser, res: Response) => {
	res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
	res.status(200).send({ message: 'Successfully logged out.' });
};

export default {
	getUsers,
	getUser,
	registerUser,
	loginUser,
	logoutUser,
};
