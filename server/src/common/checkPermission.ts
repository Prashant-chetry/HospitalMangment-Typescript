import IUsers from '../db/models/users/interface';
import { Request, NextFunction, Response } from 'express';
import HttpError from './httpError';

interface Obj {
  [key: string]: string;
}
const checkPermissions = function (obj: Obj): (req: Request, res: Response, next: NextFunction) => void {
  return function (req: Request, res: Response, next: NextFunction): void {
    if (!req.user) return next(new HttpError(false, 401, 'user not authorized to access route'));
    const user = req.user as IUsers;
    const userPermission = user.role.find((i) => obj[i]);
    console.log(userPermission, obj, user.role);
    if (!userPermission) return next(new HttpError(false, 401, 'user not authorized to access route'));
    return next();
  };
};
export default checkPermissions;
