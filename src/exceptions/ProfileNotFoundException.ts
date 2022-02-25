import HttpException from './HttpException';

class ProfileNotFoundException extends HttpException {
	constructor(id: string) {
		super(404, `Profile with id ${id} not found`);
	}
}

export default ProfileNotFoundException;
