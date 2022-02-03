import { RequestHandler, Response } from 'express';
import { Op } from 'sequelize';
import User from '../models/user.model';
import createToken from '../functions/createToken';
import Profile from '../models/profile.model';
import { TokenData } from '../interfaces/token.interface';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import { slugify } from '../functions/slugifyName';
import { ProfileCreationAttributes } from '../interfaces/profile.model.interface';
import { CompanyCreationAttributes } from '../interfaces/company.model.interface';
import Company from '../models/company.model';
import { sequelize } from '../util/database';

const getUsers: RequestHandler = async (req, res): Promise<Response> => {
	const { page, size } = req.query;

	try {
		const users = await User.findAndCountAll({
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
			include: [
				{
					model: Profile,
					attributes: ['status', 'name', 'profilePhoto'],
				},
				{
					model: Company,
					as: 'companies',
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
		await sequelize.transaction(async (t) => {
			const userDoc: User | null = await User.findOne({
				transaction: t,
				where: {
					[Op.or]: [{ username: req.body.username }, { email: req.body.email }],
				},
			});
			if (userDoc) {
				return res.status(400).json({
					message: 'User already exists. ',
				});
			}

			const created_user: User = await User.create(
				{
					username: req.body.username,
					email: req.body.email,
					role: req.body.role,
					password: req.body.password,
				},
				{ transaction: t }
			);

			const companyName = !Object.keys(req.body).includes('company_name')
				? `${created_user.username}'s company`
				: req.body.company_name;

			const company: CompanyCreationAttributes =
				await created_user.createCompany(
					{
						company_name: companyName,
						logo: req.body.logo,
						slug: slugify(companyName),
					},
					{ transaction: t }
				);

			const profile: ProfileCreationAttributes =
				await created_user.createProfile(
					{
						status: req.body.status,
						name: req.body.name,
						profilePhoto: req.body.profilePhoto,
						company_id: company.id,
					},
					{ transaction: t }
				);

			return res
				.status(201)
				.json({ user: created_user, profile: profile, company: company });
		});
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
