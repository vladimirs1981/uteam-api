import { DataTypes } from 'sequelize';

export = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.createTable('users', {
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				unique: true,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: 'email',
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		});
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.dropTable('users');
	},
};
