import HttpError from '../common/httpError';
import { NextFunction, Response, Request } from 'express';

const GlobalErrorHandler = function (error: HttpError, req: Request, res: Response, next: NextFunction): Response {
  const status: number = error.status;
  const message: string = error.message;
  const success: boolean = error.success;
  return res.status(status).json({ success, message });
};
export default GlobalErrorHandler;
