import { Sequelize } from 'sequelize';

import config from '../config/config';

export const sequelize = new Sequelize(
	config.server.db_name,
	config.server.db_user,
	config.server.db_pass,
	{
		dialect: 'mysql',
		host: 'localhost',
	}
);

export const database = {
	sequelize,
	User: sequelize,
	Profile: sequelize,
};
