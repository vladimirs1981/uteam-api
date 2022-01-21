import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME: string = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME || 'root';
const DB_USER = process.env.DB_USER || 'uteam';
const SERVER_TOKEN_EXPIRETIME = process.env.SERVER_TOKEN_EXPIRETIME || 3600;
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || 'coolIssuer';
const SERVER_TOKEN_SECRET =
	process.env.SERVER_TOKEN_SECRET || 'supersecretsecret';

const SERVER = {
	hostname: SERVER_HOSTNAME,
	port: SERVER_PORT,
	db_pass: DB_PASSWORD,
	db_name: DB_NAME,
	db_user: DB_USER,
	token: {
		expireTime: SERVER_TOKEN_EXPIRETIME,
		issuer: SERVER_TOKEN_ISSUER,
		secret: SERVER_TOKEN_SECRET,
	},
};

const config = {
	server: SERVER,
};

export default config;
