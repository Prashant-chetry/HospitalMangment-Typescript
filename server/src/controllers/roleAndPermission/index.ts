import IRolesAndPermissions from './interface';
import { Request, Response, NextFunction } from 'express';
import IUsers from '../../db/models/users/interface';
import isEmpty from '../../common/isEmpty';
import HttpError from '../../common/httpError';
import RolesAndPermissions from '../../db/models/roleAndPermissions/collection';
import * as Yup from 'yup';

class RolesAndPermissionsController implements IRolesAndPermissions {
  private user: IUsers | undefined;
  private params: Request['params'] | undefined;
  private body: Request['body'] | undefined;
  private roleSchema = Yup.array().of(Yup.string().required());
  private permissionSchema = this.roleSchema;

  public GetRoleAndPermissionByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (isEmpty(req.user || {})) return next(new HttpError(false, 402, 'unauthorized'));
    this.user = req.user as IUsers;
    const rDoc = (await RolesAndPermissions.findOne({ userId: this.user._id }).exec()) || undefined;
    if (isEmpty(rDoc || {})) return res.status(404).json({ success: false, message: 'role and permission not found' });
    return res.status(200).json({ success: true, message: 'role and permission found', data: rDoc?.toJSON() });
  };
  public SetRoleAndPermissionByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (isEmpty(req.user || {})) return next(new HttpError(false, 402, 'unauthorized'));
    this.user = req.user as IUsers;
    const rDoc = (await RolesAndPermissions.findOne({ userId: this.user._id }).exec()) || undefined;
    if (isEmpty(rDoc || {})) return res.status(404).json({ success: false, message: 'role and permission not found' });
    this.body = req.body;
    const { roles, permission }: { roles: Array<string>; permission: Array<string> } = this.body;
    try {
      if (!(await this.roleSchema.isValid(roles)) || !(await this.permissionSchema.isValid(permission))) {
        return next(new HttpError(false, 500, 'Bad Request'));
      }
    } catch (error) {
      //
    }
    try {
      rDoc?.set({
        userId: this.user._id,
        roles,
        permission,
      });
      if (await rDoc?.validate()) await rDoc?.save();
    } catch (error) {
      return next(new HttpError());
    }
  };
  public CreateRoleAndPermission = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (isEmpty(req.user || {})) return next(new HttpError(false, 402, 'unauthorized'));
    this.user = req.user as IUsers;
    if (isEmpty(req.body) || !req.params.id) return next(new HttpError(false, 500, 'Bad Request'));
    this.body = req.body;
    const { roles, permission }: { roles: Array<string>; permission: Array<string> } = this.body;
    try {
      if (!(await this.roleSchema.isValid(roles)) || !(await this.permissionSchema.isValid(permission))) {
        return next(new HttpError(false, 500, 'Bad Request'));
      }
    } catch (error) {
      console.error(error);
      return next(new HttpError());
    }
    const rDoc = (await RolesAndPermissions.findOne({ userId: this.user._id }).exec()) || undefined;
    if (!isEmpty(rDoc || {})) return next(new HttpError(false, 404, 'role already create for user'));
    const userId: IUsers['_id'] = req.params.id;
    try {
      const doc = new RolesAndPermissions({
        userId,
        roles,
        permission,
      });
      await doc.save();
    } catch (error) {
      return next(new HttpError());
    }
  };
  public GetRoleAndPermissionList = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const doc = await RolesAndPermissions.find().limit(10).exec();
      if (isEmpty(doc || {})) return next(new HttpError(false, 400, 'no data found'));
      return res.status(200).json({ success: true, message: 'roleAndPermissions List', data: JSON.stringify(doc) });
    } catch (error) {
      return next(new HttpError());
    }
  };
}
export default new RolesAndPermissionsController();
