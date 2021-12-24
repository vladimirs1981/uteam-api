import dotenv from 'dotenv';

dotenv.config();

const SERVER_HOSTNAME: string = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME || 'root';

const SERVER = {
	hostname: SERVER_HOSTNAME,
	port: SERVER_PORT,
	db_pass: DB_PASSWORD,
	db_name: DB_NAME,
};

const config = {
	server: SERVER,
};

export default config;
