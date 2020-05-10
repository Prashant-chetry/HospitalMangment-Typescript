/* eslint-disable @typescript-eslint/interface-name-prefix */
import { Request, Response, NextFunction } from 'express';
import util from 'util';

import IUserController from './interface';
import isEmpty from '../../common/isEmpty';
import HttpError from '../../common/httpError';
import IUsers, { IUsersProfileName, IUsersProfile, IUsersEmail, IUsersPhone } from '../../db/models/users/interface';
import Users from '../../db/models/users/collection';
import { Socket } from 'socket.io';
import UserDataValidation from './validation';

interface IReqBody {
  name: IUsersProfileName;
  panid: IUsersProfile['panid'];
  aadharNo: IUsersProfile['aadharId'];
  emails: Array<IUsersEmail['address']>;
  dob: IUsersProfile['dob'];
  martialStatus: IUsersProfile['martialStatus'];
  mobileNos: Array<IUsersPhone['number']>;
  gender: IUsersProfile['gender'];
}
interface IUserDataValidation {
  firstName: IUsersProfileName['first'];
  lastName: IUsersProfileName['last'];
  middleName: IUsersProfileName['middle'];
  gender: IUsersProfile['gender'];
  panid: IUsersProfile['panid'];
  aadharNo: IUsersProfile['aadharId'];
  emails: Array<IUsersEmail['address']>;
  dob: IUsersProfile['dob'];
  martialStatus: IUsersProfile['martialStatus'];
  mobileNos: Array<IUsersPhone['number']>;
  role: IUsers['role'];
}
class User implements IUserController {
  private user: IUsers | undefined;
  private body: Request['body'];
  private params: Request['params'] | undefined;
  public profileAdd = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (isEmpty(req.user || {})) return next(new HttpError(false, 402, 'unauthorized'));
    this.user = req.user as IUsers;
    this.body = req.body;
    if (isEmpty(this.body || {})) return next(new HttpError(false, 404, 'Bad Request'));
    const { name, panid, mobileNos, aadharNo, emails, dob, martialStatus, gender }: IReqBody = this.body;
    console.log(this.body);
    try {
      this.user.set({
        profile: {
          name: name || this.user.profile?.name,
          panid: panid || this.user.profile?.panid,
          aadharId: aadharNo || this.user.profile?.aadharId,
          martialStatus: martialStatus || this.user.profile?.martialStatus,
          gender: gender || this.user.profile?.gender,
        },
      });
      if (emails.length)
        emails.forEach((email) => {
          this.user?.emails.push({ address: email, verified: false });
        });
      if (mobileNos.length)
        mobileNos.forEach((mobileNo) => {
          this.user?.phones?.push({ number: mobileNo, verified: true });
        });
      if (util.types.isDate(dob)) {
        this.user.set({
          profile: {
            dob: new Date(dob) || this.user.profile?.dob,
          },
        });
      }
      if (!this.user.isModified()) return res.status(200).json({ success: true, message: 'user not Modified' });
      this.user.save();
      return res.status(200).json({ success: true, message: 'user modified successfully' });
    } catch (error) {
      return next(new HttpError());
    }
  };
  public profileById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (isEmpty(req.user || {})) return next(new HttpError(false, 402, 'unauthorized'));
    this.user = req.user as IUsers;
    this.params = req.params;
    if (!this.params.id) return next(new HttpError(false, 402, 'No id provided'));
    try {
      this.user = (await Users.findById(this.params.id).select({ password: 0, tokens: 0 }).exec()) || undefined;
      if (isEmpty(this.user || {})) return next(new HttpError(false, 400, 'user not found'));
      console.log(this.user?.toJSON());
      return res.status(200).json({ success: true, message: 'user found', data: this.user?.toJSON() });
    } catch (error) {
      next(new HttpError());
    }
  };
  public allUserList = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const { filters, options } = req.query;
    const docs: Array<IUsers> = await Users.find({}).exec();
    if (!docs.length) return res.status(200).json({ success: true, message: 'not user' });
    return res.status(200).json({ success: true, message: 'user list', data: JSON.stringify(docs) });
  };
  public profileEditById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    console.log(req.params.id, 'edit ');
    if (!req.params.id) return next(new HttpError());
    if (isEmpty(req.body)) return next(new HttpError(false, 500, 'Bad Request'));
    try {
      const doc = await Users.findById(req.params.id).exec();
      if (isEmpty(doc || {})) return next(new HttpError(false, 400, 'user not found'));
      this.body = req.body;
      this.user = req.user as IUsers;
      const { name, aadharNo, mobileNos, martialStatus, panid, emails, gender, dob }: IReqBody = this.body;
      try {
        const userValidate = new UserDataValidation();
        await userValidate.validateName(name);
        if (aadharNo) await userValidate.validateAadharNo(aadharNo);
        if (emails?.[0]?.length) await userValidate.validateEmails(emails);
        if (martialStatus) await userValidate.validateMartialStatus(martialStatus);
        if (panid) await userValidate.validatePanid(panid);
        if (gender) await userValidate.validateGender(gender);
        if (dob) await userValidate.validateDob(dob);
        if (mobileNos?.[0]?.length) await userValidate.validatePhones(mobileNos);
      } catch (error) {
        console.log(error);
        return next(new HttpError(false, 500, 'Bad Request'));
      }
      if (!isEmpty(this.body.name || {})) ((doc || {}).profile || {}).name = name;
      if (aadharNo) ((doc || {}).profile || {}).aadharId = aadharNo;
      if (panid) ((doc || {}).profile || {}).panid = panid;
      if (gender) ((doc || {}).profile || {}).gender = gender;
      if (martialStatus) ((doc || {}).profile || {}).martialStatus = martialStatus;
      if (dob) ((doc || {}).profile || {}).dob = new Date(dob);
      if (emails?.[0]?.length) {
        const nEmails: Array<IUsersEmail> = emails.map((i) => ({ verified: false, address: i }));
        if (nEmails.length) doc?.set('emails', nEmails);
      }
      if (mobileNos?.[0]?.length) {
        const nMobile: Array<IUsersPhone> = mobileNos.map((i) => ({ number: i, verified: false }));
        if (nMobile.length) doc?.set('phones', nMobile);
      }
      if (!doc?.isModified()) return res.status(200).json({ success: true, message: "User data don't update" });
      doc.updatedBy = this.user._id;
      await doc.save();
      console.log(doc);
      return res.status(200).json({ success: true, message: 'user update successfully' });
    } catch (error) {
      console.log(error);
      return next(new HttpError());
    }
  };
}
const UserController = new User();
export default UserController;
