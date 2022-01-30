import express from 'express';
import userController from '../controllers/user.controller';
import Middleware from '../middleware/handle.validations';
import UserValidator from '../validation/user.validator';
import passport from 'passport';

const router = express.Router();

//GET ALL USERS
router.get(
	'/users',
	passport.authenticate('jwt', { session: false }),
	UserValidator.checkReadUser(),
	Middleware.handleValidationErrors,
	userController.getUsers
);

//GET USER BY ID
router.get(
	'/users/:id',
	passport.authenticate('jwt', { session: false }),
	UserValidator.checkIdParams(),
	Middleware.handleValidationErrors,
	userController.getUser
);

//CREATE NEW USER
router.post(
	'/register',
	UserValidator.checkCreateUser(),
	Middleware.handleValidationErrors,
	userController.registerUser
);

//LOGIN USER
router.post(
	'/login',
	UserValidator.checkLoginUser(),
	Middleware.handleValidationErrors,
	passport.authenticate('local', { session: false }),
	userController.loginUser
);

export = router;
