import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  animations: [
    trigger('dropdownAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px) scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(-8px) scale(0.95)' }))
      ])
    ])
  ]
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
  isOpen: boolean = false;

  @HostListener('document:click', ['$event'])
  closeOnClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-wrapper')) {
      this.isOpen = false;
    }
  }


  constructor(private apiService: ApiService, private authService: AuthService, private route: ActivatedRoute, private location: Location, private router: Router) {

  }

  ngOnInit() {
    this.getCurrentUserDetails()
  }

  getCurrentUserDetails() {
    this.authService.getCurrentUserDetails().subscribe((res: any) => {
      this.userDetails = res
    })
  }

  isOnline() {
    return this.authService.getUserId()
  }

  logout() {
    this.authService.logout()
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

}
