import { Socket } from 'socket.io';

export default class SocketController {
  socket: Socket;
  constructor(socket: Socket) {
    this.socket = socket;
  }
  public fileUpload = (): void => {
    this.socket.on('file.Upload', () => {
      //
    });
  };
}
