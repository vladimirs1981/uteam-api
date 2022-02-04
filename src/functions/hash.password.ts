import * as bcrypt from 'bcryptjs';

export const generateHash = (password: string) => {
	const salt = bcrypt.genSaltSync(12);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};

export const compareHash = (password: string, hashed: string) => {
	return bcrypt.compareSync(password, hashed);
};
