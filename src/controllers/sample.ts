import { Request, Response, NextFunction } from 'express';

const sampleRoute = (req: Request, res: Response, next: NextFunction) => {
	const message: string = 'Sample route called.';
	return res.status(200).json({
		message: message,
	});
};

export default {
	sampleRoute,
};
