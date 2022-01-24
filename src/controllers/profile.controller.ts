import { Request, RequestHandler, Response } from 'express';
import { Op } from 'sequelize';
import { ProfileCreationAttributes } from '../interfaces/profile.model.interface';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import Profile from '../models/profile.model';
import User from '../models/user.model';

const getProfiles: RequestHandler = async (req, res) => {
	const { page, size } = req.query;

	try {
		const profiles = await Profile.findAndCountAll({
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

		res.status(200).send({
			result: profiles,
			pages: pages,
			'current page': +page,
		});
	} catch (err) {
		res.status(500).json({ message: 'Fail to read profiles.' });
	}
};

const postProfiles = async (req: RequestWithUser, res: Response) => {
	const { status, name, profilePhoto } = req.body;
	try {
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

const getProfile = async (req: RequestWithUser, res: Response) => {
	try {
		const { id } = req.params;
		const profile: Profile = await Profile.findOne({
			include: [
				{
					model: User,
					attributes: ['username', 'email'],
				},
			],
			where: { id },
		});
		if (!profile) {
			return res.status(404).json({ message: 'Profile not found.' });
		}
		return res.status(200).json(profile);
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

const updateProfile = async (req: RequestWithUser, res: Response) => {
	try {
		const { id } = req.params;
		const profile: Profile = await Profile.findOne({
			include: [
				{
					model: User,
					attributes: ['username', 'email'],
				},
			],
			where: { [Op.and]: [{ id: id }, { userId: req.user.id }] },
		});
		if (!profile) {
			return res.status(404).json({ message: 'Profile not found.' });
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

const deleteProfile: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const profile: Profile = await Profile.findOne({ where: { id } });
		if (!profile) {
			return res.status(404).json({ message: 'Profile not found.' });
		}
		await profile.destroy();
		return res.status(204).json({ message: 'Profile deleted.' });
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

// Profile.belongsTo(User);

export default {
	getProfiles,
	postProfiles,
	getProfile,
	updateProfile,
	deleteProfile,
};
