import { RequestHandler, Response } from 'express';
import { Op } from 'sequelize';
import User from '../models/user.model';
import createToken from '../functions/createToken';
import Profile from '../models/profile.model';
import { UserCreationAttributes } from '../interfaces/user.model.interface';
import { TokenData } from '../interfaces/token.interface';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import { generateHash } from '../functions/hash.password';

const getUsers: RequestHandler = async (req, res): Promise<Response> => {
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

const getUser: RequestHandler = async (
	req: RequestWithUser,
	res
): Promise<Response> => {
	try {
		const { id } = req.params;
		const user: User | null = await User.findOne({
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

const registerUser: RequestHandler = async (req, res): Promise<Response> => {
	try {
		const user: UserCreationAttributes = {
			username: req.body.username,
			email: req.body.email,
			role: req.body.role,
			password: generateHash(req.body.password),
		};
		const userDoc: User | null = await User.findOne({
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
		return res.status(201).json(created_user);
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

const loginUser = async (
	req: RequestWithUser,
	res: Response
): Promise<Response> => {
	try {
		const tokenData: TokenData = createToken(req.user);
		return res.status(200).json({
			message: 'OK',
			token: tokenData.token,
		});
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

export default {
	getUsers,
	getUser,
	registerUser,
	loginUser,
};
