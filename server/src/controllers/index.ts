import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import socketServer from 'socket.io';

import AuthRouter from '../routes/auth';
import RoomRouter from '../routes/rooms';
import MongoDbConnection from '../db';
import UserRouter from '../routes/user';
import checkPermissions from '../common/checkPermission';
import GlobalErrorHandler from '../middleware/ErrorHandler';
import RequestLogger from '../middleware/RequestLogger';
import SocketController from './socket';
import { Server } from 'http';
require('../middleware/passport').default;

class MainServerApp {
  private server: Application;
  private httpServer: Server | undefined;
  private io: socketServer.Server | undefined;
  private ioC: socketServer.Namespace | undefined;
  private PORT: number;
  constructor() {
    this.server = express();
    dotenv.config();
    this.PORT = parseInt(process.env.PORT || '8080', 10);
    this.initializeMongoDbConnect();
    this.initializeMiddleWare();
    this.initializeRoutesMiddle();
    this.initializeErrorMiddleWare();
    this.initializeSocketIo();
    this.startServer();
  }
  private startServer(): void {
    this.httpServer = new Server(this.server);
    this.httpServer.listen(this.PORT, () => {
      console.log('server start successfully');
    });
  }
  private initializeMongoDbConnect(): MongoDbConnection {
    return new MongoDbConnection();
  }
  private initializeMiddleWare(): void {
    this.server.use(express.json());
    this.server.use(
      cors({
        origin: '*',
        methods: 'GET,,PUT,PATCH,POST,DELETE',
      }),
    );
    this.server.use(RequestLogger);
  }
  private initializeErrorMiddleWare(): void {
    this.server.use(GlobalErrorHandler);
  }
  private initializeRoutesMiddle(): void {
    this.server.use('/api/auth', AuthRouter);
    this.server.use('/api/user', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkPermissions({ admin: 'admin' }), UserRouter);
    this.server.use('/api/room', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), checkPermissions({ admin: 'admin' }), RoomRouter);
    this.server.get(
      '/api/google',
      passport.authenticate('google', {
        scope: ['profile'],
      }),
    );
    this.server.get('/api/google/reDirect', passport.authenticate('google'), function (req, res, next) {
      console.log('rnnn');
    });
  }
  private initializeSocketIo(): void {
    this.io = socketServer(this.httpServer);
    this.ioC = this.io.of('/socketio');
    this.ioC?.on('connection', (socket) => {
      const socketCont = new SocketController(socket);
      socketCont.fileUpload();
      // socket.on('fileUpload', SocketController.fileUpload);
    });
  }
}

export default MainServerApp;
