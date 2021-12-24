import { Sequelize } from 'sequelize';

import config from '../config/config';

const sequelize = new Sequelize(
	config.server.db_name,
	config.server.db_user,
	config.server.db_pass,
	{
		dialect: 'mysql',
		host: 'localhost',
	}
);

export default sequelize;
