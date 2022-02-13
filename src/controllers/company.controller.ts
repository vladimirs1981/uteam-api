import express, {
	Request,
	RequestHandler,
	Response,
	NextFunction,
} from 'express';
import { Op } from 'sequelize';
import { slugify } from '../functions/slugifyName';
import Controller from '../interfaces/controller.interfaces';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import Company from '../models/company.model';
import Profile from '../models/profile.model';
import companyValidator from '../validation/company.validator';
import Middleware from '../middleware/handle.validations';
import passport from 'passport';
import CompanyNotFoundException from '../exceptions/CompanyNotFoundException';

class CompaniesController implements Controller {
	public path = '/companies';
	public router = express.Router();
	private company = Company;

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(
			this.path,
			companyValidator.checkReadCompany(),
			Middleware.handleValidationErrors,
			this.getAllCompanies
		);
		this.router.get(
			`${this.path}/:id`,
			companyValidator.checkIdParams(),
			Middleware.handleValidationErrors,
			this.getCompany
		);
		this.router.post(
			this.path,
			passport.authenticate('jwt', { session: false }),
			companyValidator.checkCreateCompany(),
			Middleware.handleValidationErrors,
			this.createCompany
		);
		this.router.put(
			`${this.path}/:id`,
			passport.authenticate('jwt', { session: false }),
			companyValidator.checkIdParams(),
			companyValidator.checkCreateCompany(),
			Middleware.handleValidationErrors,
			this.updateCompany
		);
		this.router.delete(
			`${this.path}/:id`,
			passport.authenticate('jwt', { session: false }),
			companyValidator.checkIdParams(),
			Middleware.handleValidationErrors,
			this.deleteCompany
		);
	}

	private getAllCompanies: RequestHandler = async (req, res) => {
		const { page, size } = req.query;

		try {
			const companies = await this.company.findAndCountAll({
				where: {},
				limit: +size,
				offset: (+page - 1) * +size,
				include: [
					{
						model: Profile,
						as: 'profiles',
					},
				],
			});

			const pages: number = Math.ceil(companies.count / +size);

			res.status(200).send({
				result: companies,
				pages: pages,
				'current page': +page,
			});
		} catch (err) {
			res.status(500).json({ message: 'Fail to read companies.', err });
		}
	};

	private createCompany = async (
		req: RequestWithUser,
		res: Response
	): Promise<Response> => {
		const { company_name, logo } = req.body;
		try {
			const company = await this.company.create({
				company_name,
				logo,
				slug: slugify(company_name),
				companyOwner: req.user.id,
			});

			const profile: Profile | null = await req.user.getProfile();

			await company.addProfile(profile);

			return res.status(201).json({ message: 'Company created.', company });
		} catch (err) {
			return res.status(500).json({ message: 'Fail to create company.', err });
		}
	};

	private getCompany = async (
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<Response> => {
		try {
			const { id } = req.params;
			const company: Company | null = await this.company.findOne({
				where: { id },
			});
			if (!company) {
				next(new CompanyNotFoundException(id));
			}
			return res.status(200).json(company);
		} catch (err) {
			return res.status(500).json({ message: 'Fail to read record.' });
		}
	};

	private updateCompany = async (
		req: RequestWithUser,
		res: Response
	): Promise<Response> => {
		try {
			const { id } = req.params;
			const company: Company | null = await this.company.findOne({
				where: { [Op.and]: [{ id: id }, { companyOwner: req.user.id }] },
			});
			if (!company) {
				return res.status(404).json({
					message: 'Company not found or must be the owner of the company.',
				});
			}
			const updatedCompany: Company = await (company as Company).update({
				company_name: req.body.company_name,
				logo: req.body.logo,
				slug: slugify(req.body.company_name),
			});
			return res
				.status(202)
				.json({ message: 'Company updated.', company: updatedCompany });
		} catch (error) {
			return res.status(500).json({ message: 'Fail to read record.' });
		}
	};

	private deleteCompany = async (
		req: RequestWithUser,
		res: Response
	): Promise<Response> => {
		try {
			const { id } = req.params;
			const company: Company | null = await this.company.findOne({
				where: { [Op.and]: [{ id: id }, { companyOwner: req.user.id }] },
			});
			if (!company) {
				return res.status(404).json({
					message: 'Company not found or must be the owner of the company.',
				});
			}
			await company.destroy();
			return res.status(204).json({ message: 'Company deleted.' });
		} catch (err) {
			return res.status(500).json({ message: 'Fail to read record.' });
		}
	};
}

export default CompaniesController;
