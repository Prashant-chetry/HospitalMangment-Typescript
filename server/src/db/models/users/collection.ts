import { Schema, model, HookNextFunction } from 'mongoose';
import IUser from './interface';
import Bcrypt from 'bcrypt';
import IUsers from './interface';

const emailSchema = new Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 4,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);
const phoneSchema = new Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 10,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);
const nameSchema = new Schema(
  {
    first: {
      type: String,
      required: true,
      default: 'No-Name',
    },
    middle: {
      type: String,
    },
    last: {
      type: String,
    },
  },
  { _id: false },
);

const tokenSchema = new Schema(
  {
    token: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    emails: {
      type: [emailSchema],
    },
    phones: {
      type: [phoneSchema],
    },
    password: {
      type: String,
      minlength: 10,
    },
    profile: {
      name: {
        type: nameSchema,
      },
      dob: {
        type: Date,
      },
      gender: {
        type: String,
        enum: ['f', 'm'],
      },
      martialStatus: {
        type: String,
        enum: ['s', 'm'],
      },
      panid: {
        type: String,
        minlength: 10,
        unique: true,
      },
      aadharId: {
        type: String,
        minlength: 12,
        unique: true,
      },
    },
    methods: {
      type: String,
      enum: ['jwt', 'google', 'facebook'],
    },
    // service: []
    tokens: [tokenSchema],
    role: {
      type: [String],
      enum: ['admin', 'user', 'manager', 'doctor', 'staff', 'patient'],
      default: 'user',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true },
);

userSchema.index({ 'emails.address': 1, 'profile.panid': 1, 'profile.aadharId': 1, 'phones.number': 1 });
userSchema.pre('save', async function (next: HookNextFunction): Promise<void> {
  const user: IUsers = this as IUsers;
  if (user.isModified('password')) next();
  user.password = await Bcrypt.hash(user.password, 10);
  next();
});
const Users = model<IUser>('users', userSchema);
export default Users;
