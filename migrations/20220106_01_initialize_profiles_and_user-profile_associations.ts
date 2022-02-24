import { DataTypes } from 'sequelize';

export = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.createTable('profiles', {
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				unique: 'id',
			},
			status: {
				type: DataTypes.ENUM({
					values: ['Pending', 'Published'],
				}),
				allowNull: false,
				defaultValue: 'Pending',
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			profilePhoto: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'https://www.pngkit.com/bigpic/u2q8u2o0w7o0o0u2/',
			},
		});
		await queryInterface.addColumn('profiles', 'userId', {
			type: DataTypes.INTEGER.UNSIGNED,
			references: { model: 'users', key: 'id' },
		});
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.dropTable('profiles');
	},
};
