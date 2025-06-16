

import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit {
  message = '';
  messages: string[] = [];

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.getMessages().subscribe((msg: string) => {
      this.messages.push(msg);
    });
  }

  send() {
    if (this.message.trim()) {
      this.socketService.sendMessage(this.message);
      this.message = '';
    }
  }
}
