import HttpException from './HttpException';

class CompanyNotFoundException extends HttpException {
	constructor(id: string) {
		super(404, `Company with id ${id} not found`);
	}
}

export default CompanyNotFoundException;
