import { RequestHandler } from 'express';
import { slugify } from '../functions/slugifyName';
import { CompanyCreationAttributes } from '../interfaces/company.model.interface';
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

const postCompany: RequestHandler = async (req, res) => {
	const { name, logo } = req.body;
	try {
		const company: CompanyCreationAttributes = await Company.create({
			name,
			logo,
			slug: slugify(name),
		});
		return res.status(201).json({ message: 'Company created.', company });
	} catch (err) {
		return res.status(500).json({ message: 'Fail to create company.', err });
	}
};

const getCompany: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const company: Company = await Company.findOne({
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

const updateCompany: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const company = await Company.findByPk(id);
		if (!company) {
			return res.status(404).json({ message: 'Company not found.' });
		}
		const updatedCompany: Company = await (company as Company).update({
			name: req.body.name,
			logo: req.body.logo,
			slug: slugify(req.body.name),
		});
		return res
			.status(202)
			.json({ message: 'Company updated.', company: updatedCompany });
	} catch (error) {
		return res.status(500).json({ message: 'Fail to read record.' });
	}
};

const deleteCompany: RequestHandler = async (req, res) => {
	try {
		const { id } = req.params;
		const company: Company = await Company.findOne({ where: { id } });
		if (!company) {
			return res.status(404).json({ message: 'Company not found.' });
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
