import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly uri: string = 'http://localhost:8088';

  constructor() {
    this.socket = io(this.uri);
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  getMessages(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('message', (msg: string) => {
        observer.next(msg);
      });
    });
  }
}
