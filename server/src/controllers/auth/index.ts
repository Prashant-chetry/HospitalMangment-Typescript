/* eslint-disable @typescript-eslint/interface-name-prefix */
import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';

import IUsers from '../../db/models/users/interface';
import Users from '../../db/models/users/collection';
import isEmpty from '../../common/isEmpty';
import HttpError from '../../common/httpError';
import IAuthenticationController from './interface';
interface ISignReqBody {
  email: string;
  password: IUsers['password'];
  reTypedPassword: IUsers['password'];
}

class Authentication implements IAuthenticationController {
  private body: Request['body'] | undefined;
  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (isEmpty(req.body || {})) return next(new HttpError(false, 500, 'Bad Request'));
    this.body = req.body;
    const { email, password, reTypedPassword }: ISignReqBody = this.body;
    if (password !== reTypedPassword) return next(new HttpError(false, 401, "password doesn't match"));
    const uDoc = await Users.findOne({ 'emails.address': email });
    if (isEmpty(uDoc || {})) return next(new HttpError(false, 401, 'user not found'));

    const accessToken: string = JWT.sign(
      {
        iss: 'hospitalManager',
        sub: uDoc?._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 2),
      },
      process.env.JWT_SECRET || '',
    );
    try {
      uDoc?.set('method', 'jwt');
      uDoc?.tokens?.push({ token: accessToken, expiresAt: new Date(new Date().setDate(new Date().getDate() + 1)) });
      const id = await uDoc?.save();
      console.log(id, 'ids');
    } catch (err) {
      console.log(err);
      return next(new HttpError());
    }
    return res.status(200).json({ success: true, message: 'successfully login', accessToken });
  };
  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (isEmpty(req.body || {})) return next(new HttpError(false, 500, 'Bad Request'));

    this.body = req.body;
    console.log(this.body);
    const { email, password, reTypedPassword }: ISignReqBody = this.body;
    if (password !== reTypedPassword) return next(new HttpError(false, 500, "Password doesn't match"));
    const uDoc = await Users.findOne({ 'emails.address': email });
    console.log(uDoc, 'userDoc');
    if (!isEmpty(uDoc || {})) {
      console.log('error', isEmpty(uDoc || {}));
      return next(new HttpError(false, 500, 'User already exists'));
    }
    try {
      const doc: IUsers = new Users({
        emails: [{ address: email }],
        password,
      });
      await doc.save();
    } catch (error) {
      console.log(error);
      return next(new HttpError());
    }
    return res.status(200).json({ success: true, message: 'successfully signIn' });
  };
}

const AuthenticationController = new Authentication();
export default AuthenticationController;
