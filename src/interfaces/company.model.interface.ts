import * as Sequelize from 'sequelize';

interface CompanyAttributes {
	id: number;
	company_name: string;
	logo: string;
	slug: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CompanyCreationAttributes
	extends Sequelize.Optional<CompanyAttributes, 'id' | 'logo'> {}

export interface CompanyInstance
	extends Sequelize.Model<CompanyAttributes, CompanyCreationAttributes>,
		CompanyAttributes {
	createdAt?: Date;
	updatedAt?: Date;
}
