import { DataTypes } from 'sequelize';

export = {
	up: async ({ context: queryInterface }) => {
		await queryInterface.createTable('companies', {
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
				unique: 'id',
			},
			company_name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			logo: {
				type: DataTypes.STRING,
				defaultValue:
					'https://www.pngfind.com/pngs/m/665-6659827_enterprise-comments-default-company-logo-png-transparent-png.png',
			},
			slug: {
				type: DataTypes.STRING,
				unique: 'slug',
			},
		});
		await queryInterface.addColumn('profiles', 'company_id', {
			type: DataTypes.INTEGER.UNSIGNED,
			references: { model: 'companies', key: 'id' },
		});
	},
	down: async ({ context: queryInterface }) => {
		await queryInterface.dropTable('companies');
	},
};
