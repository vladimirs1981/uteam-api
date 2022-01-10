import express from 'express';
import userController from '../controllers/user';
import Middleware from '../middleware/handle.validations';
import UserValidator from '../validation/user.validator';

const router = express.Router();

router.get('/users', userController.getUsers);

router.post(
	'/register',
	UserValidator.checkCreateUser(),
	Middleware.handleValidationErrors,
	userController.registerUser
);

router.post('/login', userController.loginUser);

export = router;
