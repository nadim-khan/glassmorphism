import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToasterService } from '../../services/toaster.service';
import { ApiService } from '../../services/api.service';
import { InputDropdownComponent } from '../input-dropdown/input-dropdown.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputDropdownComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  isLogin = true;
  countryList: any[] = [];
  stateList: any[] = [];
  cityList: any[] = [];
  showDropdown = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toasterService: ToasterService,
    private apiService: ApiService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.required]],
    }, { validators: this.passwordMatchValidator() });
    this.isLogin = this.authService.getUserId() ? false : true;
    this.updateFormControlList();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirm = control.get('confirmPassword')?.value;
      if (this.isLogin) {
        return null
      }
      return password === confirm ? null : { passwordMismatch: true };
    };
  }



  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.loginForm.patchValue({ profilePic: file });
        this.selectedFile = file;
        this.loginForm.patchValue({ 'profilePic': this.selectedFile })
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const formData = new FormData();
      const formValue = this.loginForm.value;

      Object.keys(formValue).forEach((key) => {
        formData.append(key, formValue[key]);
      });

      if (this.selectedFile) {
        formData.append('profilePic', this.selectedFile);
      }
      if (this.isLogin) {
        this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((response: any) => {
          this.router.navigate(['/quran']);
          this.toasterService.success('Successfully Logged In');
        }, (err: any) => {
          this.toasterService.error('Error in Login')
        })
      } else {
        if (this.loginForm.valid) {
          this.authService.signup(this.loginForm).subscribe((response: any) => {
            debugger
            this.router.navigate(['/chat']);
            this.toasterService.success(`Welcome ${response.name} !`)
          })
        }
      }

    }
  }

  onRegister() {
    this.loginForm.reset();
    this.updateFormControlList();
  }

  get fc() {
    return this.loginForm.controls;
  }

  updateFormControlList() {
    let controls = ['name', 'confirmPassword', 'country', 'state', 'city', 'address'];
    if (this.isLogin) {

      controls.forEach((controlName: any) => {
        this.loginForm.removeControl(controlName);
      })
      this.loginForm.removeControl('profilePic');

    } else {
      controls.forEach((controlName: any) => {
        let fc = new FormControl('', [Validators.required]);
        this.loginForm.addControl(controlName, fc);
      });
      this.loginForm.addControl('profilePic', new FormControl([''], [Validators.required]));


      this.getCountryList()
    }
  }

  getCountryList() {
    this.apiService.getCountries().subscribe((data: any) => {
      this.countryList = data.data;
    })
  }

  onSelectDropdown(event: any) {
    if (event.controlName === 'country') {
      let controls = ['name', 'confirmPassword', 'country', 'state', 'city', 'address'];
      this.apiService.getStateByCountryName(event.selected.country).subscribe((data: any) => {
        this.stateList = data.data.states;
      });
    }

    if (event.controlName === 'state') {
      let controls = ['name', 'confirmPassword', 'country', 'state', 'city', 'address'];
      this.apiService.getCityByCountryStateName(this.loginForm.value['country'], this.loginForm.value['state']).subscribe((data: any) => {
        this.cityList = data.data.reduce((acc: any, val: any) => {
          acc.push({ name: val })
          return acc
        }, []);
      });
    }


  }


}
