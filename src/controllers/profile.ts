import { RequestHandler } from 'express';
import Profile from '../models/profile';
import User from '../models/user';

const getProfiles: RequestHandler = async (req, res) => {
	try {
		const limit = req.query?.limit as number | undefined;
		const profiles = Profile.findAll({ where: {}, limit });
		return res.status(200).json(profiles);
	} catch (err) {
		res.status(500).json({ message: 'Fail to read profiles.' });
	}
};

const postProfiles: RequestHandler = async (req, res) => {
	try {
		const profile = await Profile.create({ ...req.body });
		return res.json({ message: 'Profile created.', profile });
	} catch (err) {
		return res.status(500).json({ message: 'Fail to create profile.' });
	}
};

const getProfile: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const profile = await Profile.findOne({ where: { id } });
		if (!profile) {
			return res.json({ message: 'Profile not found.' });
		}
		return res.json(profile);
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

const updateProfile: RequestHandler = async (req, res) => {
	const { id } = req.params;

	//	const updProfile = await Profile.update(req.body, {where: { id: id}});
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
};

const deleteProfile: RequestHandler = async (req, res) => {
	const { id } = req.params;
	const profile = await Profile.findOne({ where: { id } });
	if (!profile) {
		return res.json({ message: 'Profile not found.' });
	}
	await profile.destroy();
	return res.status(200).json({ message: 'Profile deleted.' });
};

Profile.belongsTo(User);

export default {
	getProfiles,
	postProfiles,
	getProfile,
	updateProfile,
	deleteProfile,
};
