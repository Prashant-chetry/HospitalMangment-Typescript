import { Document } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IApiResponses extends Document {
  url: string;
  headers: Array<string>;
  body?: object;
  clientIp?: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  processingTime: Date;
  pid: string;
  createdAt: Date;
  updatedAt: Date;
}
