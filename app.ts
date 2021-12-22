import express, { Request, Response, NextFunction } from 'express';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

const port = process.env.PORT;

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.status(200).json({
		message: 'Status OK',
	});
});

app.listen(port, () => {
	console.log(`Server running on port:${port}`);
});
