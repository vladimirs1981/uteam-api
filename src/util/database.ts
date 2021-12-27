import { Sequelize } from 'sequelize';
import { InitUser } from '../models/user';

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
	User: InitUser(sequelize),
};
