import IUsers from '../users/interface';
import { Document } from 'mongoose';

/* eslint-disable @typescript-eslint/interface-name-prefix */
export interface INumberOfBed {
  total?: number;
  occupied?: number;
}
export default interface IRooms extends Document {
  roomNo: number;
  numberOfbeds?: INumberOfBed;
  userIds?: Array<IUsers['_id']>;
  createdAt: Date;
  updatedAt: Date;
}
