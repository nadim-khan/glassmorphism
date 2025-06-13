import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-quran',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quran.component.html',
  styleUrl: './quran.component.scss'
})
export class QuranComponent {
  dropdownActive = false;
  activeTranslation = 0;

  translationList: any[] = [
    { id: 0, displayName: "Asad (english)", link: 'en', isNotify: false, isActive: true },
    { id: 1, displayName: "Uthmani", link: 'users', isNotify: true, isActive: false },
    { id: 2, displayName: "Alafasy (Arabic)", link: 'products', isNotify: true, isActive: false }
  ]

  toggleDropdown(event: Event) {
    debugger
    event.stopPropagation();
    this.dropdownActive = !this.dropdownActive;
  }
}
