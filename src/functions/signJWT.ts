import jwt from 'jsonwebtoken';
import config from '../config/config';
import { UserAttributes } from '../models/user';

const signJWT = (
	user: UserAttributes,
	callback: (error: Error | null, token: string | null) => void
): void => {
	const timeSinceEpoch = new Date().getTime();
	const expirationTime =
		timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
	const expirationTimeInSeconds = Math.floor(expirationTime / 1000);

	console.log(`Attempting to sign token for ${user.username}`);

	try {
		jwt.sign(
			{
				username: user.username,
			},
			config.server.token.secret,
			{
				issuer: config.server.token.issuer,
				algorithm: 'HS256',
				expiresIn: expirationTimeInSeconds,
			},
			(error, token) => {
				if (error) {
					callback(error, null);
				} else if (token) {
					callback(null, token);
				}
			}
		);
	} catch (error) {
		throw new Error('Error occured');
	}
};

export default signJWT;
