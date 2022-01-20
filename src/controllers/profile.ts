import { Request, RequestHandler, Response } from 'express';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import Profile from '../models/profile';
import User from '../models/user';

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

		const pages = Math.ceil(profiles.count / +size);

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
		const profile = await req.user.createProfile({
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

const getProfile: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const profile = await Profile.findOne({
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

const updateProfile: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const profile = await Profile.findByPk(id);
		if (!profile) {
			return res.status(404).json({ message: 'Profile not found.' });
		}
		const updatedProfile = await (profile as Profile).update({
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
		const profile = await Profile.findOne({ where: { id } });
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
