import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss'
})
export class ToasterComponent {
  alertMessageList: any;
  constructor(private toasterService: ToasterService) {

  }

  ngOnInit() {
    this.toasterService.alert$.subscribe(message => {
      this.alertMessageList = message; // Show message or hide when null
    });
  }
}
