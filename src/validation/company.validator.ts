import { body, param, query } from 'express-validator';

class CompanyValidator {
	checkCreateCompany() {
		return [
			body('id').optional().isNumeric(),
			body('company_name')
				.notEmpty()
				.withMessage('Name can not be empty.')
				.isString()
				.isLength({ min: 2 })
				.withMessage('Name must be string minimum 2 characters long.'),
			body('logo')
				.optional()
				.isURL()
				.withMessage('Logo must be a valid URL string.'),
			body('slug').isSlug().optional(),
		];
	}

	checkReadCompany() {
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

export default new CompanyValidator();
