import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IAuthenticationController {
  logIn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  signUp: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
}
