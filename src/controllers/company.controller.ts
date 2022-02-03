import { RequestHandler, Response } from 'express';
import { Op } from 'sequelize';
import { slugify } from '../functions/slugifyName';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import Company from '../models/company.model';
import Profile from '../models/profile.model';

const getCompanies: RequestHandler = async (req, res) => {
	const { page, size } = req.query;

	try {
		const companies = await Company.findAndCountAll({
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
		res.status(500).json({ message: 'Fail to read companies.' });
	}
};

const postCompany = async (
	req: RequestWithUser,
	res: Response
): Promise<Response> => {
	const { company_name, logo } = req.body;
	try {
		const company = await Company.create({
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

const getCompany: RequestHandler = async (req, res): Promise<Response> => {
	try {
		const { id } = req.params;
		const company: Company | null = await Company.findOne({
			where: { id },
		});
		if (!company) {
			return res.status(404).json({ message: 'Company not found.' });
		}
		return res.status(200).json(company);
	} catch (err) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

const updateCompany = async (
	req: RequestWithUser,
	res: Response
): Promise<Response> => {
	try {
		const { id } = req.params;
		const company: Company | null = await Company.findOne({
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

const deleteCompany = async (
	req: RequestWithUser,
	res: Response
): Promise<Response> => {
	try {
		const { id } = req.params;
		const company: Company | null = await Company.findOne({
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

export default {
	getCompanies,
	postCompany,
	getCompany,
	updateCompany,
	deleteCompany,
};
