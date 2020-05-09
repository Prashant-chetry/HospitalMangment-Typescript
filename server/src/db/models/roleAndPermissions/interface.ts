import { Document } from 'mongoose';
import IUsers from '../users/interface';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IRolesAndPermissions extends Document {
  userId: IUsers['_id'];
  roles: Array<'admin' | 'user' | 'guest'>;
  permissions: Array<'write' | 'read' | 'edit' | 'create'>;
  createdAt: Date;
  updatedAt: Date;
}
