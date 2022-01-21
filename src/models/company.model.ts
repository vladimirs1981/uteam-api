import * as Sequelize from 'sequelize';
import { CompanyInstance } from '../interfaces/company.model.interface';
import { sequelize } from '../util/database';
import Profile from './profile.model';

class Company extends Sequelize.Model implements CompanyInstance {
	id!: number;
	name!: string;
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
		projects: Sequelize.Association<Company, Profile>;
	};
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
