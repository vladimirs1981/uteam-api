import { Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, req: Request, res: Response) {
	const status = error.status || 500;
	const message = error.message || 'Something wentr wrong';
	res.status(status).send({
		status,
		message,
	});
}

export default errorMiddleware;
