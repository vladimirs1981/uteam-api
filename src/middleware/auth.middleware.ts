import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { DataStoredInToken } from '../interfaces/token.interface';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import User from '../models/user.model';
import config from '../config/config';

const authMiddleware = async (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
): Promise<Response> => {
	const authHeader = req.get('Authorization');
	if (!authHeader) {
		return res.status(401).send({ message: 'Not authenticated.' });
	}
	const token = authHeader.split(' ')[1];
	const secret = config.server.token.secret;
	try {
		const verificationResponse = jwt.verify(token, secret) as DataStoredInToken;
		const username = verificationResponse.username;
		const user: User | null = await User.findOne({ where: { username } });
		if (user) {
			req.user = user;
			next();
		} else {
			return res.status(404).send({ messge: 'User not found' });
		}
	} catch (error) {
		return res.status(401).send('unauthorized');
	}
};

export default authMiddleware;
