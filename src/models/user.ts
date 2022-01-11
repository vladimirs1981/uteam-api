import * as Sequelize from 'sequelize';
import { sequelize } from '../util/database';
import Profile from './profile';

export interface UserAttributes {
	id: number;
	username: string;
	email: string;
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
	password!: string;
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
		password: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		//	indexes: [{ unique: true, fields: ['email'] }],
		tableName: 'users',
		sequelize: sequelize,
		modelName: 'user',
	}
);
Profile.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Profile, { foreignKey: 'userId' });

export default User;
