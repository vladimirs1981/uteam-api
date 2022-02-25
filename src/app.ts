import express from 'express';
import cors from 'cors';
import config from './config/config';
import { configurePassport } from './middleware/passport.strategies';
import Controller from './interfaces/controller.interfaces';
import errorMiddleware from './middleware/error.middleware';

class App {
	public app: express.Application;

	constructor(controllers: Controller[]) {
		this.app = express();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
		this.intializeErrorHandling();
	}

	public listen() {
		this.app.listen(config.server.port, () => {
			console.log(`Server is running on port:${config.server.port}`);
		});
	}

	private initializeMiddlewares() {
		configurePassport(this.app);
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(
			cors({
				origin: ['http://localhost:3000'],
			})
		);
	}

	private intializeErrorHandling() {
		this.app.use(errorMiddleware);
	}

	private initializeControllers(controllers: Controller[]) {
		controllers.forEach((controller) => {
			this.app.use(controller.router);
		});
	}
}

export default App;
