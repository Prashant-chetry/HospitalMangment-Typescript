import express, { Router } from 'express';
import AuthenticationController from '../controllers/auth';

const router: Router = express.Router();
router.post('/logIn', AuthenticationController.logIn);
router.post('/signUp', AuthenticationController.signUp);

export default router;
