import { Router } from 'express';
import UserController from '../controllers/user';

const router: Router = Router();
router.post('/add', UserController.profileAdd);
router.get('/profile/:id', UserController.profileById);
router.get('/allUser', UserController.allUserList);
router.post('/edit/:id', UserController.profileEditById);
export default router;

// doctor speacial
// appointment
// medis
