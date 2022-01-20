import * as Sequelize from 'sequelize';
import { sequelize } from '../util/database';
import Profile from './profile';

interface CompanyAttributes {
	id: number;
	name: string;
	logo: string;
	slug: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CompanyCreationAttributes
	extends Sequelize.Optional<CompanyAttributes, 'id'> {}

interface CompanyInstance
	extends Sequelize.Model<CompanyAttributes, CompanyCreationAttributes>,
		CompanyAttributes {
	createdAt?: Date;
	updatedAt?: Date;
}

class Company extends Sequelize.Model implements CompanyInstance {
	id!: number;
	name!: string;
	logo!: string;
	slug!: string;
}

Company.init(
	{
		id: {
			type: Sequelize.DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			unique: true,
		},
		name: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
		logo: {
			type: Sequelize.DataTypes.STRING,
			allowNull: true,
		},
		slug: {
			type: Sequelize.DataTypes.STRING,
			unique: true,
		},
	},
	{
		tableName: 'companies',
		modelName: 'company',
		sequelize: sequelize,
	}
);

Company.hasMany(Profile, { as: 'profiles', foreignKey: 'company_id' });
Profile.belongsTo(Company, {
	foreignKey: 'company_id',
	as: 'company',
});

export default Company;
