import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IRoomController {
  getAllRooms: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  addNewRooms: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  getRoomById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
  editRoomsById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>;
}
