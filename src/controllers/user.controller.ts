import * as express from 'express';
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
import Controller from '../interfaces/controller.interfaces';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import passport from 'passport';
import Middleware from '../middleware/handle.validations';
import UserValidator from '../validation/user.validator';

class UsersController implements Controller {
	public path = '/users';
	public router = express.Router();
	private user = User;

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(
			this.path,
			passport.authenticate('jwt', { session: false }),
			UserValidator.checkReadUser(),
			Middleware.handleValidationErrors,
			this.getAllUsers
		);
		this.router.get(
			`${this.path}/:id`,
			passport.authenticate('jwt', { session: false }),
			UserValidator.checkIdParams(),
			Middleware.handleValidationErrors,
			this.getUserById
		);
		this.router.post(
			this.path,
			UserValidator.checkCreateUser(),
			Middleware.handleValidationErrors,
			this.registerUser
		);
		this.router.post(
			`${this.path}/login`,
			UserValidator.checkLoginUser(),
			Middleware.handleValidationErrors,
			passport.authenticate('local', { session: false }),
			this.loginUser
		);
	}

	private getAllUsers = async (req: express.Request, res: express.Response) => {
		const { page, size } = req.query;

		try {
			const users = await this.user.findAndCountAll({
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

	private getUserById = async (
		req: RequestWithUser,
		res: express.Response,
		next: express.NextFunction
	): Promise<express.Response> => {
		try {
			const { id } = req.params;
			const user: User | null = await this.user.findOne({
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
				next(new UserNotFoundException(id));
			}
			res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ message: 'Fail to read record.' });
		}
	};

	private registerUser = async (
		req: express.Request,
		res: express.Response
	): Promise<express.Response> => {
		try {
			await sequelize.transaction(async (t) => {
				const userDoc: User | null = await this.user.findOne({
					transaction: t,
					where: {
						[Op.or]: [
							{ username: req.body.username },
							{ email: req.body.email },
						],
					},
				});
				if (userDoc) {
					return res.status(400).json({
						message: 'User already exists. ',
					});
				}

				const created_user: User = await this.user.create(
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

				const company: CompanyCreationAttributes = await Company.create(
					{
						company_name: companyName,
						logo: req.body.logo,
						slug: slugify(companyName),
						companyOwner: created_user.id,
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

				return res.status(201).json({
					user: created_user,
					profile: profile,
					company: company,
				});
			});
		} catch (err) {
			return res.status(500).json({ message: 'Fail to read record.' });
		}
	};

	private loginUser = async (
		req: RequestWithUser,
		res: express.Response
	): Promise<express.Response> => {
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
}

export default UsersController;
