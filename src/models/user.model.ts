import * as Sequelize from 'sequelize';
import { HasOneCreateAssociationMixin } from 'sequelize';
import { Role, UserInstance } from '../interfaces/user.model.interface';
import { sequelize } from '../util/database';
import Profile from './profile.model';

class User extends Sequelize.Model implements UserInstance {
	id!: number;
	username!: string;
	email!: string;
	role!: Role;
	password!: string;

	declare createProfile: HasOneCreateAssociationMixin<Profile>;
}

User.init(
	{
		id: {
			type: Sequelize.DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			unique: true,
		},
		username: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
			unique: 'email',
		},
		role: {
			type: Sequelize.DataTypes.ENUM({
				values: ['company_user', 'company_admin', 'superadmin'],
			}),
			allowNull: false,
			defaultValue: 'company_user',
		},
		password: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: 'users',
		sequelize: sequelize,
		modelName: 'user',
	}
);
Profile.belongsTo(User, {
	foreignKey: 'userId',
	constraints: true,
	onDelete: 'CASCADE',
});
User.hasOne(Profile, { foreignKey: 'userId' });

export default User;
