import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MakeRequestService } from '../../services/make-request.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class ChatComponent implements OnInit {
  currentUserId: any = ''; // For demo; replace with auth user
  users: any[] = [
  ];

  selectedUser?: any;
  messages: { from: string; text: string }[] = [];
  message = '';

  constructor(private socketService: SocketService, private makeRequestService: MakeRequestService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();
    this.socketService.register(this.currentUserId);
    this.socketService.onPrivateMessage().subscribe(msg => {
      this.messages.push({ from: msg.fromUserId, text: msg.message });
    });
    this.makeRequestService.getAllUsers().subscribe((data: any) => {
      this.users = data.body;
    })
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.messages = []; // Reset or load chat history
  }

  sendMessage() {
    if (this.selectedUser && this.message.trim()) {
      this.socketService.sendPrivateMessage(this.selectedUser._id, this.message);
      this.messages.push({ from: this.currentUserId, text: this.message });
      this.message = '';
    }
  }
}
