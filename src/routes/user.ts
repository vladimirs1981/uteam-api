import express from 'express';
import userController from '../controllers/user';
import Middleware from '../middleware/handle.validations';
import UserValidator from '../validation/user.validator';
import extractJWT from '../middleware/extractJWT';

const router = express.Router();

router.get('/validate', extractJWT, userController.validateToken);

router.get('/users', userController.getUsers);

router.get('/users/:id', userController.getUser);

router.post(
	'/register',
	UserValidator.checkCreateUser(),
	Middleware.handleValidationErrors,
	userController.registerUser
);

router.post('/login', userController.loginUser);

export = router;
