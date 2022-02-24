import { DataTypes } from 'sequelize';

export = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.addColumn('users', 'role', {
			type: DataTypes.ENUM({
				values: ['company_user', 'company_admin', 'superadmin'],
			}),
			allowNull: false,
			defaultValue: 'company_user',
		});
		await queryInterface.addColumn('companies', 'companyOwner', {
			type: DataTypes.INTEGER.UNSIGNED,
			references: { model: 'users', key: 'id' },
		});
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.removeColumn('users', 'role');
		await queryInterface.removeColumn('companies', 'companyOwner');
	},
};
