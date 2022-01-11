import { RequestHandler } from 'express';
import Profile from '../models/profile';
import User from '../models/user';

const getProfiles: RequestHandler = async (req, res) => {
	try {
		const profiles = await Profile.findAll({
			include: [User],
			limit: 20,
			where: {},
		});
		return res.status(200).json(profiles);
	} catch (err) {
		res.status(500).json({ message: 'Fail to read profiles.' });
	}
};

const postProfiles: RequestHandler = async (req, res) => {
	const { userId, status, name, profilePhoto } = req.body;
	try {
		const user = await User.findOne({ where: { id: userId } });
		const profile = await Profile.create({
			status,
			name,
			profilePhoto,
			userId: user?.id,
		});
		return res.json({ message: 'Profile created.', profile });
	} catch (err) {
		return res.status(500).json({ message: 'Fail to create profile.' });
	}
};

const getProfile: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const profile = await Profile.findOne({ include: [User], where: { id } });
		if (!profile) {
			return res.json({ message: 'Profile not found.' });
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
			return res.json({ message: 'Profile not found.' });
		}
		const updatedProfile = await (profile as Profile).update({
			status: req.body.status,
			name: req.body.name,
			profilePhoto: req.body.profilePhoto,
		});
		return res
			.status(200)
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
			return res.json({ message: 'Profile not found.' });
		}
		await profile.destroy();
		return res.status(200).json({ message: 'Profile deleted.' });
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
