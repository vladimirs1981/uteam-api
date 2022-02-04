import passport from 'passport';
import { Application } from 'express';
import * as PassportLocal from 'passport-local';
import * as PassportJWT from 'passport-jwt';
import { compareHash } from '../functions/hash.password';
import User from '../models/user.model';
import { DataStoredInToken } from '../interfaces/token.interface';
import config from '../config/config';

export const configurePassport = (app: Application) => {
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	passport.use(
		new PassportLocal.Strategy(
			{ usernameField: 'usernameOrEmail', passwordField: 'password' },
			async (usernameOrEmail, password, done) => {
				try {
					const criteria =
						usernameOrEmail.indexOf('@') === -1
							? { username: usernameOrEmail }
							: { email: usernameOrEmail };
					const user: User | null = await User.findOne({ where: criteria });
					if (user && compareHash(password, user.password)) {
						done(null, user);
					} else {
						done(null, false);
					}
				} catch (error) {
					done(error);
				}
			}
		)
	);

	passport.use(
		new PassportJWT.Strategy(
			{
				jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: config.server.token.secret,
			},
			async (payload: DataStoredInToken, done) => {
				try {
					const user: User | null = await User.findOne({
						where: { username: payload.username },
					});
					if (user) {
						done(null, user);
					} else {
						done(null, false);
					}
				} catch (error) {
					done(error);
				}
			}
		)
	);

	app.use(passport.initialize());
};
