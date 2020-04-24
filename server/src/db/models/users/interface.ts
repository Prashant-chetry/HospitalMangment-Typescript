/* eslint-disable @typescript-eslint/interface-name-prefix */
import { Document } from 'mongoose';

export interface IUserProfileName {
  first?: string;
  middle?: string;
  last?: string;
}
export interface IUsersProfile {
  name?: IUserProfileName;
  dob?: Date;
  gender?: 'f' | 'm';
  martialStatus?: string;
  panid?: string;
  aadharId?: string;
}
export interface IUsersEmail {
  address: string;
  verified: boolean;
}
export interface IUsersPhone {
  number: string;
  verified: boolean;
}
export interface IUsersToken {
  token?: string;
  expiresAt?: Date;
}
export default interface IUsers extends Document {
  emails: Array<IUsersEmail>;
  phones?: Array<IUsersPhone>;
  password: string;
  profile?: IUsersProfile;
  methods?: string;
  tokens?: Array<IUsersToken>;
  createdAt: Date;
  updatedAt: Date;
  role: Array<'admin' | 'basic'>;
  createdBy?: IUsers['_id'];
  updatedBy?: IUsers['_id'];
}
