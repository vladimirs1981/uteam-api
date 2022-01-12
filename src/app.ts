import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config/config';
import sampleRoute from './routes/sample';
import userRoutes from './routes/user';
import profileRoutes from './routes/profile';
import { database } from './util/database';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	cors({
		origin: ['http://localhost:3000'],
	})
);

/*Routes*/
app.use(sampleRoute);
app.use(userRoutes);
app.use(profileRoutes);

/**Error handling */
app.use((req: Request, res: Response) => {
	const error = new Error('Not Found');

	return res.status(404).json({
		message: error.message,
	});
});

/**Server + DB */
(async () => {
	await database.sequelize.sync({ alter: true }).then(() => {
		app.listen(config.server.port, () => {
			console.log(`Server is running on port:${config.server.port}`);
		});
	});
})();
