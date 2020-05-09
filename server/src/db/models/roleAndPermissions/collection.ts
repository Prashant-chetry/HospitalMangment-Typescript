import { Schema, model } from 'mongoose';
import IRolesAndPermissions from './interface';
const rolesArray = ['admin', 'guest', 'user'];
const permissionArray = ['write', 'read', 'edit', 'create'];
const RolesAndPermissionsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      unique: true,
      required: true,
    },
    roles: {
      type: [String],
      enum: rolesArray,
      required: true,
      default: 'guest',
    },
    permissions: {
      type: [String],
      enum: permissionArray,
      required: true,
      default: 'read',
    },
  },
  {
    timestamps: true,
  },
);
RolesAndPermissionsSchema.index({ userId: 1 });
const RolesAndPermissions = model<IRolesAndPermissions>('rolesAndPermissions', RolesAndPermissionsSchema);
export default RolesAndPermissions;
