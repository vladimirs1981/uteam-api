import { DataTypes } from 'sequelize';

export = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.addColumn('companies', 'createdAt', {
			type: DataTypes.DATE,
		});
		await queryInterface.addColumn('companies', 'updatedAt', {
			type: DataTypes.DATE,
		});
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.removeColumn('companies', 'createdAt');
		await queryInterface.removeColumn('companies', 'updatedAt');
	},
};
