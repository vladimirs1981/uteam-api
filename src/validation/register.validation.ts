import { Joi } from 'express-validation';

export const RegisterValidation = Joi.object({
	username: Joi.string().min(3).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(5).required(),
});
