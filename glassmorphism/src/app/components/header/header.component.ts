import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isFocused = false;
  userDetails: any;
  dropdownActive = false;
  activeLinkIndex = 0;
  menuList: any[] = [
    { id: 0, displayName: "Quran Api's", link: 'quran', isNotify: false, isActive: true },
    { id: 1, displayName: "Users", link: 'users', isNotify: true, isActive: false },
    { id: 2, displayName: "Products", link: 'products', isNotify: true, isActive: false }
  ];



  toggleDropdown(event: Event) {
    debugger
    event.stopPropagation();
    this.dropdownActive = !this.dropdownActive;
  }

  constructor(private apiService: ApiService, private authService: AuthService, private route: ActivatedRoute, private location: Location, private router: Router) {

  }

  ngOnInit() {

  }

  isOnline() {
    return this.authService.getUserId()
  }

  logout() {
    this.authService.logout()
  }

}
