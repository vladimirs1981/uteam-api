import express from 'express';
import companyController from '../controllers/company.controller';
import companyValidator from '../validation/company.validator';
import Middleware from '../middleware/handle.validations';
import passport from 'passport';

const router = express.Router();

//GET all companies
router.get(
	'/companies',
	companyValidator.checkReadCompany(),
	Middleware.handleValidationErrors,
	companyController.getCompanies
);

//POST create new company
router.post(
	'/companies',
	passport.authenticate('jwt', { session: false }),
	companyValidator.checkCreateCompany(),
	Middleware.handleValidationErrors,
	companyController.postCompany
);

//GET company
router.get(
	'/companies/:id',
	companyValidator.checkIdParams(),
	Middleware.handleValidationErrors,
	companyController.getCompany
);

//PUT update company
router.put(
	'/companies/:id',
	passport.authenticate('jwt', { session: false }),
	companyValidator.checkIdParams(),
	companyValidator.checkCreateCompany(),
	Middleware.handleValidationErrors,
	companyController.updateCompany
);

//DELETE company
router.delete(
	'/companies/:id',
	passport.authenticate('jwt', { session: false }),
	companyValidator.checkIdParams(),
	Middleware.handleValidationErrors,
	companyController.deleteCompany
);

export = router;
