import { body, param, oneOf, check, query } from 'express-validator';

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
			body('role')
				.notEmpty()
				.withMessage('Role can not be empty')
				.isIn(['company_user', 'company_admin', 'superadmin'])
				.withMessage(
					'Enter role value: company_user,  company_admin or superadmin'
				),
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

	checkReadUser() {
		return [
			query('page')
				.notEmpty()
				.withMessage('Page query should not be empty.')
				.isInt({ min: 1 })
				.withMessage('Page limit minimum is 1'),
			query('size')
				.notEmpty()
				.withMessage('Size query should not be empty.')
				.isInt({ min: 1, max: 20 })
				.withMessage('Set size query  from 1 to 20'),
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
