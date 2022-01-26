import jwt from 'jsonwebtoken';
import config from '../config/config';
import { TokenData, DataStoredInToken } from '../interfaces/token.interface';
import { UserAttributes } from '../interfaces/user.model.interface';

const createToken = (user: UserAttributes): TokenData => {
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

export default createToken;
