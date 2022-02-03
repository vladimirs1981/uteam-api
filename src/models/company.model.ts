import * as Sequelize from 'sequelize';
import { CompanyInstance } from '../interfaces/company.model.interface';
import { sequelize } from '../util/database';
import Profile from './profile.model';
import User from './user.model';

class Company extends Sequelize.Model implements CompanyInstance {
	id!: number;
	company_name!: string;
	logo!: string;
	slug!: string;

	declare getProfiles: Sequelize.HasManyGetAssociationsMixin<Profile>;
	declare addProfile: Sequelize.HasManyAddAssociationMixin<Profile, number>;
	declare hasProfile: Sequelize.HasManyHasAssociationMixin<Profile, number>;
	declare removeProfile: Sequelize.HasManyRemoveAssociationMixin<
		Profile,
		number
	>;
	declare countProfiles: Sequelize.HasManyCountAssociationsMixin;
	declare setProfiles: Sequelize.HasManySetAssociationsMixin<Profile, number>;
	declare createProfile: Sequelize.HasManyCreateAssociationMixin<Profile>;

	declare readonly profiles?: Profile[];

	declare static associations: {
		profiles: Sequelize.Association<Company, Profile>;
		user: Sequelize.Association<Company, User>;
	};
}

Company.init(
	{
		id: {
			type: Sequelize.DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			unique: 'id',
		},
		company_name: {
			type: Sequelize.DataTypes.STRING,
			allowNull: true,
		},
		logo: {
			type: Sequelize.DataTypes.STRING,
			defaultValue:
				'https://www.pngfind.com/pngs/m/665-6659827_enterprise-comments-default-company-logo-png-transparent-png.png',
		},
		slug: {
			type: Sequelize.DataTypes.STRING,
			unique: 'slug',
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

User.hasMany(Company, { as: 'companies', foreignKey: 'companyOwner' });
Company.belongsTo(User, { foreignKey: 'companyOwner' });

export default Company;
