import express from 'express';
import passport from 'passport';
import profileController from '../controllers/profile.controller';
import Middleware from '../middleware/handle.validations';
import ProfileValidator from '../validation/profile.validator';

const router = express.Router();

//GET all profiles
router.get(
	'/profiles',
	ProfileValidator.checkReadProfile(),
	Middleware.handleValidationErrors,
	profileController.getProfiles
);

//CREATE new profile
router.post(
	'/profiles',
	passport.authenticate('jwt', { session: false }),
	ProfileValidator.checkCreateProfile(),
	Middleware.handleValidationErrors,
	profileController.postProfiles
);

//GET single profile
router.get(
	'/profiles/:id',
	ProfileValidator.checkIdParams(),
	Middleware.handleValidationErrors,
	profileController.getProfile
);

//UPDATE profile
router.put(
	'/profiles/:id',
	passport.authenticate('jwt', { session: false }),
	ProfileValidator.checkIdParams(),
	ProfileValidator.checkUpdateProfile(),
	Middleware.handleValidationErrors,
	profileController.updateProfile
);

//DELETE profile
router.delete(
	'/profiles/:id',
	passport.authenticate('jwt', { session: false }),
	ProfileValidator.checkIdParams(),
	Middleware.handleValidationErrors,
	profileController.deleteProfile
);

export = router;
