import * as Sequelize from 'sequelize';

export enum Status {
	Pending,
	Published,
}

export interface ProfileAttributes {
	id: number;
	status: Status;
	name: string;
	profilePhoto: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProfileCreationAttributes
	extends Sequelize.Optional<ProfileAttributes, 'id'> {}

export interface ProfileInstance
	extends Sequelize.Model<ProfileAttributes, ProfileCreationAttributes>,
		ProfileAttributes {
	createdAt?: Date;
	updatedAt?: Date;
}
