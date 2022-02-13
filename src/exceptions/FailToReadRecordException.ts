import HttpException from './HttpException';

class FailToReadRecordException extends HttpException {
	constructor() {
		super(500, `Fail to read record`);
	}
}

export default FailToReadRecordException;
