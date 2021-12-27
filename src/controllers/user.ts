import express, { Request, Response, NextFunction, Router } from 'express';
import { database } from '../util/database';
import User from '../models/user';

const allUsers = (req: Request, res: Response, next: NextFunction) => {
	User.findAll()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((err) => console.log(err));
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
	User.create({
		id: Math.random(),
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
	})
		.then((user) => {
			res.status(201).json({
				user: JSON.stringify(user),
				message: 'User created',
			});
		})
		.catch((err) => console.log(err));
};

// export const getUsers = (req: Request, res: Response, next: NextFunction) => {
//     User.findAll
// };

export default {
	allUsers,
	createUser,
};
