import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config/config';
import sampleRoute from './routes/sample';
import { database } from './util/database';

const app: Application = express();

app.use(express.json());
app.use(
	cors({
		origin: ['http://localhost:3000'],
	})
);

/*Routes*/
app.use(sampleRoute);

/**Error handling */
app.use((req: Request, res: Response, next: NextFunction) => {
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
