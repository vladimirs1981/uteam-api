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
			body('userId')
				.notEmpty()
				.isNumeric()
				.withMessage(
					'userId can not be empty, must be a valid number user id.'
				),
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
			query('limit')
				.notEmpty()
				.isInt({ max: 20 })
				.withMessage('Query limit should not be empty. Set it to 20.'),
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
