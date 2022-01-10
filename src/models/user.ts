import * as Sequelize from 'sequelize';
import { sequelize } from '../util/database';

interface UserAttributes {
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
			type: Sequelize.DataTypes.STRING(128),
			allowNull: false,
		},
		email: {
			type: Sequelize.DataTypes.STRING(128),
			allowNull: false,
			unique: true,
		},
		password: {
			type: Sequelize.DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		tableName: 'users',
		sequelize: sequelize,
		modelName: 'user',
	}
);

export default User;
