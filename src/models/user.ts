import * as Sequelize from 'sequelize';

interface UserAttributes {
	id: number;
	username: string;
	email: string;
	password: string;
}

class User extends Sequelize.Model implements UserAttributes {
	id!: number;
	username!: string;
	email!: string;
	password!: string;
}

export const InitUser = (sequelize: Sequelize.Sequelize) => {
	User.init(
		{
			id: {
				type: Sequelize.DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			username: {
				type: Sequelize.DataTypes.STRING(128),
				allowNull: false,
			},
			email: {
				type: Sequelize.DataTypes.STRING(128),
				allowNull: false,
			},
			password: {
				type: Sequelize.DataTypes.STRING(128),
				allowNull: false,
			},
		},
		{
			tableName: 'users',
			sequelize,
		}
	);
};
