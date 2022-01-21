import * as Sequelize from 'sequelize';

interface CompanyAttributes {
	id: number;
	name: string;
	logo: string;
	slug: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CompanyCreationAttributes
	extends Sequelize.Optional<CompanyAttributes, 'id'> {}

export interface CompanyInstance
	extends Sequelize.Model<CompanyAttributes, CompanyCreationAttributes>,
		CompanyAttributes {
	createdAt?: Date;
	updatedAt?: Date;
}
