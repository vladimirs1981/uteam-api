import { body, param, query } from 'express-validator';

class ProfileValidator {
	checkCreateProfile() {
		return [
			body('id').optional().isNumeric(),
			body('status')
				.notEmpty()
				.isIn(['Pending', 'Published'])
				.withMessage('Enter status value: Pending or Published'),
			body('name')
				.notEmpty()
				.withMessage('Name can not be empty.')
				.isString()
				.isLength({ min: 3 })
				.withMessage('Name must be string minimum 3 characters long.'),
			body('profilePhoto')
				.optional()
				.isURL()
				.withMessage('Profile photo must be a valid URL string.'),
		];
	}

	checkUpdateProfile() {
		return [
			body('id').optional().isNumeric(),
			body('status')
				.notEmpty()
				.isIn(['Pending', 'Published'])
				.withMessage('Enter status value: Pending or Published'),
			body('name')
				.notEmpty()
				.withMessage('Name can not be empty.')
				.isString()
				.isLength({ min: 3 })
				.withMessage('Name must be string minimum 3 characters long.'),
			body('profilePhoto')
				.optional()
				.isURL()
				.withMessage('Profile photo must be a valid URL string.'),
		];
	}

	checkReadProfile() {
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

export default new ProfileValidator();
