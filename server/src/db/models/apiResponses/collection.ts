import { Schema, model } from 'mongoose';
import IApiResponses from './interface';

const apiResponseSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    clientIp: {
      type: String,
    },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
      uppercase: true,
      required: true,
    },
    headers: {
      type: [String],
      required: true,
    },
    body: {
      type: Object,
    },
    processingTime: {
      type: Date,
      required: true,
    },
    pid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const ApiResponses = model<IApiResponses>('apiResponses', apiResponseSchema);
export default ApiResponses;
