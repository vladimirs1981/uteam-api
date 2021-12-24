import { Sequelize, Model, DataTypes } from 'sequelize';

import config from '../config/config';

const sequelize = new Sequelize(
	`mysql://${config.server.db_user}:${config.server.db_pass}@${config.server.hostname}:3306/uteam`
);

interface UserAttributes {
	id: number;
	username: string;
	email: string;
	password: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
	id!: number;
	username!: string;
	email!: string;
	password!: string;
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		email: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		password: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		tableName: 'users',
		sequelize,
	}
);
