import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginSuccessDialogComponent } from '../login-success-dialog/login-success-dialog.component';
import { LoginErrorDialogComponent } from '../login-error-dialog/login-error-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        await signInWithEmailAndPassword(this.auth, email, password);
        this.openSuccessDialog();
        this.router.navigate(['/']);
      } catch (error) {
        this.openErrorDialog();
        console.error('Login error', error);
      }
    }
  }

  openSuccessDialog(): void {
    this.dialog.open(LoginSuccessDialogComponent);
  }

  openErrorDialog(): void {
    this.dialog.open(LoginErrorDialogComponent);
  }
}
