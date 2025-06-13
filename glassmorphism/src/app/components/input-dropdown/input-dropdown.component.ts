import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

interface Option {
  [key: string]: string;
}

@Component({
  selector: 'app-input-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-dropdown.component.html',
  styleUrl: './input-dropdown.component.scss'
})
export class InputDropdownComponent {
  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() label: string = '';
  @Input() options: Option[] = [];
  @Input() optionKey: string = '';
  @Output() onSelect = new EventEmitter()

  showDropdown = false;

  get filteredOptions(): Option[] {
    const search = this.form.get(this.controlName)?.value?.toLowerCase() || '';
    return this.options.filter((opt: any) =>
      opt[this.optionKey]?.toLowerCase().includes(search)
    );
  }

  selectItem(item: any) {
    this.form.get(this.controlName)?.setValue(item[this.optionKey]);
    this.showDropdown = false;
    this.onSelect.emit({ controlName: this.controlName, selected: item });
    this.showDropdown = false;
  }
}
