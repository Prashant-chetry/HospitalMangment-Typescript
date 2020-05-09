import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IUserController {
  profileAdd: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  profileById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  allUserList: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  profileEditById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  // roleAndPermission: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
}
