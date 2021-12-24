import express, { Application, Request, Response, NextFunction } from 'express';
import config from './config/config';
import sampleRoute from './routes/sample';
import sequelize from './util/database';

const app: Application = express();

/*Routes*/
app.use(sampleRoute);

/**Error handling */
app.use((req: Request, res: Response, next: NextFunction) => {
	const error = new Error('Not Found');

	return res.status(404).json({
		message: error.message,
	});
});

/**Server */
sequelize.sync().then(() => {
	app.listen(config.server.port, () => {
		console.log(
			`Server running on ${config.server.hostname}:${config.server.port}`
		);
	});
});
