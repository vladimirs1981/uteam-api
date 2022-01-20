import jwt from 'jsonwebtoken';
import config from '../config/config';
import { TokenData, DataStoredInToken } from '../interfaces/token.interfaces';
import { UserAttributes } from '../models/user';

export const createCookie = (tokenData: TokenData) => {
	return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
};

export const createToken = (user: UserAttributes): TokenData => {
	const timeSinceEpoch = new Date().getTime();
	const expirationTime =
		timeSinceEpoch + Number(config.server.token.expireTime) * 100000;
	const expirationTimeInSeconds = Math.floor(expirationTime / 1000);
	const expiresIn = expirationTimeInSeconds; // an hour
	const secret = config.server.token.secret;
	const dataStoredInToken: DataStoredInToken = {
		username: user.username,
	};
	return {
		expiresIn,
		token: jwt.sign(dataStoredInToken, secret, {
			expiresIn,
			issuer: config.server.token.issuer,
			algorithm: 'HS256',
		}),
	};
};

export const signJWT = (
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
