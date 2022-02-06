import App from './app';
import CompaniesController from './controllers/company.controller';
import ProfilesController from './controllers/profile.controller';
import UsersController from './controllers/user.controller';

const app = new App([
	new UsersController(),
	new ProfilesController(),
	new CompaniesController(),
]);

app.listen();
