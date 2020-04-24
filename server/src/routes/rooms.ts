import express from 'express';
import RoomController from '../controllers/room';
const router = express();

router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getRoomById);
router.post('/addNew', RoomController.addNewRooms);
router.put('/editById/:id', RoomController.editRoomsById);

export default router;
