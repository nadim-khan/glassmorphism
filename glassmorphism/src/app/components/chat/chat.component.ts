import { Component, HostListener, OnInit } from '@angular/core';
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
  currentUserId: any;
  users: any[] = [];
  selectedUser: any;
  messages: { from: string; message: string; to: string, timestamp?: any }[] = [];
  message = '';
  userDetails: any;

  constructor(
    private socketService: SocketService,
    private makeRequestService: MakeRequestService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserId();

    this.socketService.register(this.currentUserId);

    this.getCurrentUserDetails();

    this.socketService.onPrivateMessage().subscribe(msg => {
      this.messages.push({
        from: msg.fromUserId,
        message: msg.message,
        to: this.currentUserId
      });
    });

    this.makeRequestService.getAllUsers().subscribe((data: any) => {
      this.users = data.body;
    });
  }

  getCurrentUserDetails() {
    this.authService.getCurrentUserDetails().subscribe((res: any) => {
      this.userDetails = res;
    });
  }

  loadMessageHistory(from: any, to: any) {
    this.makeRequestService.getAllMessages(from, to).subscribe(res => {
      if (res.success) {
        // Load messages where current user is sender or receiver
        this.messages = res.messages.filter(m =>
          m.from === this.currentUserId || m.to === this.currentUserId
        );
      }
    });
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.loadMessageHistory(this.userDetails._id, this.selectedUser._id);
  }

  sendMessage() {
    if (this.selectedUser && this.message.trim()) {
      this.socketService.sendPrivateMessage(this.selectedUser._id, this.message);
      this.messages.push({
        from: this.currentUserId,
        message: this.message,
        to: this.selectedUser._id
      });
      this.message = '';
    }
  }
}
