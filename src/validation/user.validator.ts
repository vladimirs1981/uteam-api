import { body } from 'express-validator';

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
					'Password can not be empty and must be minimun 3 characters long.'
				),
		];
	}
}

export default new UserValidator();
