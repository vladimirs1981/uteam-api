import App from './app';
import CompaniesController from './controllers/company.controller';
import ProfilesController from './controllers/profile.controller';
import UsersController from './controllers/user.controller';
import { database } from './util/database';

(async (): Promise<void> => {
	try {
		await database.sequelize.authenticate();
		await database.runMigrations();
		console.log('Connecting to DB...');
	} catch (error) {
		console.log('Error while connecting to database', error);
	}
	const app = new App([
		new UsersController(),
		new ProfilesController(),
		new CompaniesController(),
	]);

	app.listen();
})();
