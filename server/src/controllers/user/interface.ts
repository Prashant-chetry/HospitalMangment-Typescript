import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IUserController {
  profileAddEditExisting: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  profileById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
}
