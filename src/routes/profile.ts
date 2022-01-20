import express from 'express';
import profileController from '../controllers/profile';
import authMiddleware from '../middleware/auth.middleware';
import extractJWT from '../middleware/extractJWT';
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
	authMiddleware,
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
	ProfileValidator.checkIdParams(),
	ProfileValidator.checkUpdateProfile(),
	Middleware.handleValidationErrors,
	profileController.updateProfile
);

//DELETE profile
router.delete(
	'/profiles/:id',
	ProfileValidator.checkIdParams(),
	Middleware.handleValidationErrors,
	profileController.deleteProfile
);

export = router;
