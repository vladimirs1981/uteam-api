import * as Sequelize from 'sequelize';
import { sequelize } from '../util/database';

enum Status {
	Pending,
	Published,
}

interface ProfileAttributes {
	id: number;
	status: Status;
	name: string;
	profilePhoto: string;
	userId: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ProfileCreationAttributes
	extends Sequelize.Optional<ProfileAttributes, 'id'> {}

interface ProfileInstance
	extends Sequelize.Model<ProfileAttributes, ProfileCreationAttributes>,
		ProfileAttributes {
	createdAt?: Date;
	updatedAt?: Date;
}

class Profile extends Sequelize.Model implements ProfileInstance {
	id!: number;
	status!: Status;
	name!: string;
	profilePhoto!: string;
	userId!: number;
}

Profile.init(
	{
		id: {
			type: Sequelize.DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			unique: true,
		},
		status: {
			type: Sequelize.DataTypes.ENUM({
				values: ['Pending', 'Published'],
			}),
			allowNull: false,
		},
		name: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
		profilePhoto: {
			type: Sequelize.DataTypes.STRING,
			allowNull: true,
		},
		userId: {
			type: Sequelize.DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		tableName: 'profiles',
		sequelize: sequelize,
		modelName: 'profile',
	}
);

export default Profile;
