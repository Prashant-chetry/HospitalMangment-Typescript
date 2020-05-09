/* eslint-disable @typescript-eslint/interface-name-prefix */
import { Response, Request, NextFunction } from 'express';

interface IRolesAndPermissions {
  GetRoleAndPermissionByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  SetRoleAndPermissionByUserId: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  GetRoleAndPermissionList: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  CreateRoleAndPermission: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
}

export default IRolesAndPermissions;
