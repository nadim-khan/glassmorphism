import { Component } from '@angular/core';
import { MakeRequestService } from '../../services/make-request.service';
import { CommonModule } from '@angular/common';
import { ShortNamePipe } from '../../pipes/short-name.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ShortNamePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  usersList: any[] = [];
  constructor(private makeRequestService: MakeRequestService) {

  }

  ngOnInit() {
    this.makeRequestService.getAllUsers().subscribe((data: any) => {
      this.usersList = data.body;
    })
  }
}
