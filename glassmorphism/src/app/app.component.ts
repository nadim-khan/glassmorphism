import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { ToasterComponent } from './components/toaster/toaster.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'glassmorphism';
  isFocused = false;
  isLightMode: boolean = false;

  constructor(private renderer: Renderer2, private authServie: AuthService) {

  }

  toggleTheme(): void {
    const rootElement = document.documentElement; // or document.body

    this.isLightMode = !this.isLightMode;

    if (this.isLightMode) {
      this.renderer.addClass(rootElement, 'light-mode');
    } else {
      this.renderer.removeClass(rootElement, 'light-mode');
    }
  }

  isLoggedIn() {
    return this.authServie.getUserId();
  }
}
