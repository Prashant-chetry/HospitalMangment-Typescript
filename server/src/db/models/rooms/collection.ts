import { Schema, model } from 'mongoose';
import IRooms from './interface';

const numberOfBedsSchema = new Schema(
  {
    total: {
      type: Number,
    },
    occupied: {
      type: Number,
    },
  },
  { _id: false },
);
const roomSchema = new Schema(
  {
    roomNo: {
      type: Number,
      required: true,
      minlength: 1,
      unique: true,
    },
    numberOfBeds: {
      type: numberOfBedsSchema,
    },
    userIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Rooms = model<IRooms>('rooms', roomSchema);
export default Rooms;
