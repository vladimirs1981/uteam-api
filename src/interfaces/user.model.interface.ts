import * as Sequelize from 'sequelize';

export enum Role {
	company_user,
	company_admin,
	superadmin,
}

export interface UserAttributes {
	id: number;
	username: string;
	email: string;
	role: Role;
	password: string;
}

//id is optional
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserCreationAttributes
	extends Sequelize.Optional<UserAttributes, 'id'> {}

export interface UserInstance
	extends Sequelize.Model<UserAttributes, UserCreationAttributes>,
		UserAttributes {
	createdAt?: Date;
	updatedAt?: Date;
}
