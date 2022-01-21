import { body, param, oneOf, check } from 'express-validator';

class UserValidator {
	checkCreateUser() {
		return [
			body('username')
				.notEmpty()
				.withMessage('Username can not be empty')
				.matches('^[a-zA-Z]([._-]?[a-zA-Z0-9]+)*$')
				.withMessage('Username must start with a letter character.')
				.isLength({ min: 2 })
				.withMessage('Username must be minimum 2 characters long.'),
			body('email').notEmpty().withMessage('Email can not be empty').isEmail(),
			body('password')
				.notEmpty()
				.isLength({ min: 6 })
				.withMessage(
					'Password can not be empty and must be minimun 6 characters long.'
				),
		];
	}

	checkLoginUser() {
		return [
			oneOf([
				check('username')
					.exists()
					.withMessage('username or email is required')
					.isLength({ min: 2 })
					.withMessage('wrong username length'),

				check('email')
					.exists()
					.withMessage('username or email is required')
					.isEmail()
					.withMessage('email not valid'),
			]),
			check('password').exists().withMessage('password is required'),
		];
	}

	checkIdParams() {
		return [
			param('id')
				.notEmpty()
				.withMessage('Id should not be empty, enter valid profile Id.'),
		];
	}
}

export default new UserValidator();
