import config from '../config/config';
import { NextFunction, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import User from '../models/user';

const extractJWT = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	console.log('Validating token');

	const token = req.headers.authorization?.split(' ')[1];

	console.log(token);

	if (token) {
		jwt.verify(token, config.server.token.secret, async (error, decoded) => {
			if (error) {
				return res.status(404).json({
					message: error.message,
					error,
				});
			} else {
				const username = decoded.username;
				const user = await User.findOne({ where: { username } });
				if (user) {
					req.user = user;
					res.locals.jwt = decoded;
					next();
				}
			}
		});
	} else {
		return res.status(401).json({
			message: 'Unauthorized',
		});
	}
};

export default extractJWT;
