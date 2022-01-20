import * as Sequelize from 'sequelize';
import { HasOneCreateAssociationMixin } from 'sequelize';
import user from '../controllers/user';
import { sequelize } from '../util/database';
import Profile from './profile';

enum Role {
	company_user,
	company_admin,
	superadmin,
}

export interface UserAttributes {
	id: number;
	username: string;
	email: string;
	role: Role;
	password: string;
}

//id is optional
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserCreationAttributes
	extends Sequelize.Optional<UserAttributes, 'id'> {}

interface UserInstance
	extends Sequelize.Model<UserAttributes, UserCreationAttributes>,
		UserAttributes {
	createdAt?: Date;
	updatedAt?: Date;
}

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
