import config from '../config/config';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const extractJWT: RequestHandler = async (req, res, next) => {
	console.log('Validating token');

	const token = req.headers.authorization?.split(' ')[1];

	if (token) {
		jwt.verify(token, config.server.token.secret, (error, decoded) => {
			if (error) {
				return res.status(404).json({
					message: error.message,
					error,
				});
			} else {
				res.locals.jwt = decoded;
				next();
			}
		});
	} else {
		return res.status(401).json({
			message: 'Unauthorized',
		});
	}
};

export default extractJWT;
