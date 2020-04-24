import { Request, Response, NextFunction } from 'express';
import Rooms from '../../db/models/rooms/collection';
import HttpError from '../../common/httpError';
import isEmpty from '../../common/isEmpty';
import IRooms, { INumberOfBed } from '../../db/models/rooms/interface';
import IRoomController from './interface';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IAddRoomsBody {
  roomNo: IRooms['roomNo'];
  numberOfBeds: INumberOfBed;
}

class Room implements IRoomController {
  private body: Request['body'];
  public getAllRooms = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const { filters, options } = req.query;
    try {
      const rooms = await Rooms.find({}).exec();
      return res.status(200).json({ success: true, message: 'rooms data', data: JSON.stringify(rooms) });
    } catch (error) {
      return next(new HttpError());
    }
  };
  public addNewRooms = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (isEmpty(req.body || {})) return next(new HttpError(false, 500, 'Bad Request'));
    this.body = req.body;
    const { roomNo, numberOfBeds } = this.body;
    if (!roomNo) return next(new HttpError(false, 500, 'Bad Request'));
    try {
      const doc: IRooms = new Rooms({
        roomNo,
        numberOfBeds,
      });
      await doc.save();
    } catch (error) {
      next(new HttpError());
    }
  };
  public getRoomById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (req.params.id) return next(new HttpError(false, 500, 'Bad Request'));
    const id = req.params.id;
    const rDoc = await Rooms.findById(id).exec();
    if (isEmpty(rDoc || {})) return next(new HttpError());
    return;
  };
  public editRoomsById = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    if (req.params.id) return next(new HttpError(false, 500, 'Bad Request'));
    if (isEmpty(req.body || {})) return next(new HttpError(false, 500, 'Bad Request'));
    this.body = req.body;
    const { roomNo, numberOfBeds } = this.body;
    const data: { roomNo?: IRooms['roomNo']; numberOfBeds?: INumberOfBed } = {};
    if (roomNo) data.roomNo = roomNo;
    if (!isEmpty(numberOfBeds || {})) data.numberOfBeds = numberOfBeds;
    const id = req.params.id;
    try {
      const rDoc = await Rooms.findById(id).exec();
      rDoc?.set(data);
      await rDoc?.save();
    } catch (error) {
      return next(new HttpError());
    }
    return res.status(200).json({ success: true, message: 'room edited successfully' });
  };
}
const RoomController = new Room();

export default RoomController;
