import * as Sequelize from 'sequelize';
import { ProfileInstance, Status } from '../interfaces/profile.model.interface';
import { sequelize } from '../util/database';
import User from './user.model';

class Profile extends Sequelize.Model implements ProfileInstance {
	id!: number;
	status!: Status;
	name!: string;
	profilePhoto!: string;

	declare setUser: Sequelize.HasOneSetAssociationMixin<User, number>;
}

Profile.init(
	{
		id: {
			type: Sequelize.DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
			unique: 'id',
		},
		status: {
			type: Sequelize.DataTypes.ENUM({
				values: ['Pending', 'Published'],
			}),
			allowNull: false,
			defaultValue: 'Pending',
		},
		name: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
		},
		profilePhoto: {
			type: Sequelize.DataTypes.STRING,
			allowNull: false,
			defaultValue: 'https://www.pngkit.com/bigpic/u2q8u2o0w7o0o0u2/',
		},
	},
	{
		tableName: 'profiles',
		sequelize: sequelize,
		modelName: 'profile',
		timestamps: false,
	}
);

export default Profile;
