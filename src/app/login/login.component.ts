import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider , signInWithPopup } from '@angular/fire/auth';
import { Database, ref, set, get } from '@angular/fire/database';
import { Router } from '@angular/router';
import { LoginSuccessDialogComponent } from '../login-success-dialog/login-success-dialog.component';
import { LoginErrorDialogComponent } from '../login-error-dialog/login-error-dialog.component';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { th } from 'date-fns/locale';

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
    MatIconModule, // Add this import
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
    private db: Database,
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
        this.router.navigate(['/profile']);
      } catch (error) {
        this.openErrorDialog();
        console.error('Login error', error);
      }
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      console.log('Starting Google Sign-In');
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      console.log('Google Sign-In successful', user);

      const userRef = ref(this.db, `members/${user.uid}`);
      console.log('Checking if user exists');
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        console.log('User does not exist, creating new record');
        const userNumber = await this.getUniqueUserNumber();
        const registrationDate = this.getFormattedDate();
        const newUserData = {
          userNumber,
          username: '',
          email: user.email,
          registrationDate,
          status: 'inactive'
        };
        console.log('New user data:', newUserData);
        await set(userRef, newUserData);
        console.log('New user data saved successfully');
      } else {
        console.log('User already exists');
      }

      // Check if username is empty
      const userData = (await get(userRef)).val();
      console.log('User data:', userData);
      if (!userData.username) {
        console.log('Username is empty, navigating to complete profile');
        this.router.navigate(['/complete-profile']);
      } else {
        console.log('Username exists, opening success dialog');
        this.openSuccessDialog();
        this.router.navigate(['/profile']);
      }
    } catch (error: unknown) {
      console.error('Google Sign-In error', error);
      if (error instanceof Error) {
        if ('code' in error && error.code === 'PERMISSION_DENIED') {
          console.error('Firebase Rules are preventing write operation');
        }
      }
      this.openErrorDialog();
    }
  }

  async signInWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;

      const userRef = ref(this.db, `members/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        const userNumber = await this.getUniqueUserNumber();
        const registrationDate = this.getFormattedDate();

        await set(userRef, {
          userNumber,
          username: '',
          email: '',
          registrationDate,
          status: 'inactive'
        });
      }

      const userData = (await get(userRef)).val();
      if (!userData.username) {
        this.router.navigate(['/complete-profile']);
      } else {
        this.openSuccessDialog();
        this.router.navigate(['/profile']);
      }
    } catch (error) {
      console.error('Facebook Sign-In error', error);
      this.openErrorDialog();
    }
  }

  async getUniqueUserNumber(): Promise<string> {
    const userNumberRef = ref(this.db, 'lastUserNumber');
    const snapshot = await get(userNumberRef);
    let lastUserNumber = 0;

    if (snapshot.exists()) {
      lastUserNumber = snapshot.val();
    }

    const newUserNumber = lastUserNumber + 1;
    await set(userNumberRef, newUserNumber);

    // Convert the number to a string, pad with zeros, and add "DV" prefix
    const paddedNumber = newUserNumber.toString().padStart(6, '0');
    return `DV${paddedNumber}`;
  }
  
  getFormattedDate(): string {
    const timeZone = 'Asia/Bangkok';
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    return format(zonedDate, 'dd/MM/yyyy HH:mm', { locale: th });
  }

  openSuccessDialog(): void {
    this.dialog.open(LoginSuccessDialogComponent);
  }

  openErrorDialog(): void {
    this.dialog.open(LoginErrorDialogComponent);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}