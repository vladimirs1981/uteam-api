import express from 'express';
import userController from '../controllers/user';
import Middleware from '../middleware/handle.validations';
import UserValidator from '../validation/user.validator';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

//SAMPLE ROUTE TO CHECK TOKEN
router.get('/validate', extractJWT, userController.validateToken);

//GET ALL USERS
router.get('/users', userController.getUsers);

//GET USER BY ID
router.get(
	'/users/:id',
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

export = router;
