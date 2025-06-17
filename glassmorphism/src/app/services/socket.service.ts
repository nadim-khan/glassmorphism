import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private readonly SERVER_URL = 'http://localhost:8088';

  constructor() {
    this.socket = io(this.SERVER_URL);
  }

  // Register user with server
  register(userId: string) {
    this.socket.emit('register', userId);
  }

  // Send message to another user
  sendPrivateMessage(toUserId: string, message: string) {
    this.socket.emit('send-private-message', { toUserId, message });
  }

  // Listen for private messages
  onPrivateMessage(): Observable<{ fromUserId: string, message: string }> {
    return new Observable(observer => {
      this.socket.on('private-message', (data) => {
        observer.next(data);
      });
    });
  }
}
