import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent {
  taskForm: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.taskForm = this.fb.group({
      task: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.taskForm.reset();
    }
  }
}
