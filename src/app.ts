import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config/config';
import userRoutes from './routes/user.routes';
import profileRoutes from './routes/profile.routes';
import companyRoutes from './routes/company.routes';
import { database } from './util/database';

import { configurePassport } from './middleware/passport.strategies';

const app: Application = express();

configurePassport(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: ['http://localhost:3000'],
	})
);

/*Routes*/
app.use(userRoutes);
app.use(profileRoutes);
app.use(companyRoutes);

/**Error handling */
app.use((req: Request, res: Response) => {
	const error = new Error('Not Found');
	return res.status(404).json({
		message: error.message,
	});
});

/**Server + DB */
(async (): Promise<void> => {
	await database.sequelize.sync({ alter: true, force: false }).then(() => {
		app.listen(config.server.port, () => {
			console.log(`Server is running on port:${config.server.port}`);
		});
	});
})();
