import express from 'express';
import userController from '../controllers/user';
import Middleware from '../middleware/handle.validations';
import UserValidator from '../validation/user.validator';
import extractJWT from '../middleware/extractJWT';
import authMiddleware from '../middleware/auth.middleware';

const router = express.Router();

//GET ALL USERS
router.get(
	'/users',
	authMiddleware,
	UserValidator.checkReadUser(),
	Middleware.handleValidationErrors,
	userController.getUsers
);

//GET USER BY ID
router.get(
	'/users/:id',
	authMiddleware,
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
	userController.loginUser
);

router.post('/logout', authMiddleware, userController.logoutUser);

export = router;
