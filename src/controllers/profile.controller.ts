import express, { NextFunction, Request, Response } from 'express';
import { Op } from 'sequelize';
import Controller from '../interfaces/controller.interfaces';
import { ProfileCreationAttributes } from '../interfaces/profile.model.interface';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import Profile from '../models/profile.model';
import User from '../models/user.model';
import Middleware from '../middleware/handle.validations';
import ProfileValidator from '../validation/profile.validator';
import passport from 'passport';
import ProfileNotFoundException from '../exceptions/ProfileNotFoundException';

class ProfilesController implements Controller {
	public path = '/profiles';
	public router = express.Router();
	private profile = Profile;

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(
			this.path,
			ProfileValidator.checkReadProfile(),
			Middleware.handleValidationErrors,
			this.getAllProfiles
		);
		this.router.get(
			`${this.path}/:id`,
			ProfileValidator.checkIdParams(),
			Middleware.handleValidationErrors,
			this.getProfileById
		);
		this.router.post(
			this.path,
			passport.authenticate('jwt', { session: false }),
			ProfileValidator.checkCreateProfile(),
			Middleware.handleValidationErrors,
			this.createProfile
		);
		this.router.put(
			`${this.path}/:id`,
			passport.authenticate('jwt', { session: false }),
			ProfileValidator.checkIdParams(),
			ProfileValidator.checkUpdateProfile(),
			Middleware.handleValidationErrors,
			this.updateProfile
		);
		this.router.delete(
			`${this.path}/:id`,
			passport.authenticate('jwt', { session: false }),
			ProfileValidator.checkIdParams(),
			Middleware.handleValidationErrors,
			this.deleteProfile
		);
	}

	private getAllProfiles = async (req: Request, res: Response) => {
		const { page, size } = req.query;

		try {
			const profiles = await this.profile.findAndCountAll({
				include: [
					{
						model: User,
						attributes: ['username', 'email'],
					},
				],
				limit: +size,
				offset: (+page - 1) * +size,
				where: {},
			});

			const pages: number = Math.ceil(profiles.count / +size);

			return res.status(200).send({
				result: profiles,
				pages: pages,
				'current page': +page,
			});
		} catch (err) {
			return res.status(500).json({ message: 'Fail to read profiles.' });
		}
	};

	private getProfileById = async (
		req: RequestWithUser,
		res: Response,
		next: NextFunction
	): Promise<Response> => {
		try {
			const { id } = req.params;
			const profile: Profile | null = await this.profile.findOne({
				include: [
					{
						model: User,
						attributes: ['username', 'email'],
					},
				],
				where: { id },
			});
			if (!profile) {
				next(new ProfileNotFoundException(id));
			}
			return res.status(200).json(profile);
		} catch (err) {
			return res.status(500).json({ message: 'Fail to read record.' });
		}
	};

	private createProfile = async (
		req: RequestWithUser,
		res: Response
	): Promise<Response> => {
		const { status, name, profilePhoto } = req.body;
		try {
			const existingProfile = await this.profile.findOne({
				where: { userId: req.user.id },
			});
			if (existingProfile) {
				return res.status(403).send({ message: 'User already have profile.' });
			}

			const profile: ProfileCreationAttributes = await req.user.createProfile({
				status,
				name,
				profilePhoto,
				userId: req.user.id,
			});
			return res.status(201).json({ message: 'Profile created.', profile });
		} catch (err) {
			return res.status(500).json({ message: 'Fail to create profile.', err });
		}
	};

	private updateProfile = async (
		req: RequestWithUser,
		res: Response
	): Promise<Response> => {
		try {
			const { id } = req.params;
			const profile: Profile | null = await this.profile.findOne({
				include: [
					{
						model: User,
						attributes: ['username', 'email'],
					},
				],
				where: { [Op.and]: [{ id: id }, { userId: req.user.id }] },
			});
			if (!profile) {
				return res.status(404).json({
					message: 'Profile not found or must be the owner of the profile.',
				});
			}
			const updatedProfile: Profile = await (profile as Profile).update({
				status: req.body.status,
				name: req.body.name,
				profilePhoto: req.body.profilePhoto,
			});
			return res
				.status(202)
				.json({ message: 'Profile updated.', profile: updatedProfile });
		} catch (err) {
			return res.status(500).json({ message: 'Fail to read record.' });
		}
	};

	private deleteProfile = async (
		req: RequestWithUser,
		res: Response
	): Promise<Response> => {
		try {
			const { id } = req.params;
			const profile: Profile | null = await this.profile.findOne({
				where: { id, userId: req.user.id },
			});
			if (!profile) {
				return res.status(404).json({
					message: 'Profile not found or must be the owner of the profile.',
				});
			}
			await profile.destroy();
			return res.status(204).json({ message: 'Profile deleted.' });
		} catch (err) {
			return res.status(500).json({ message: 'Fail to read record.' });
		}
	};
}

export default ProfilesController;
