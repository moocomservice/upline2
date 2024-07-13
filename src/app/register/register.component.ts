import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Database, ref, set, get } from '@angular/fire/database';
import { Router } from '@angular/router';
import { RegisterErrorDialogComponent } from '../register-error-dialog/register-error-dialog.component';
import { RegisterSuccessDialogComponent } from '../register-success-dialog/register-success-dialog.component';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private db: Database,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, username } = this.registerForm.value;
      console.log('Form is valid, starting registration process...');
      try {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        console.log('User created:', userCredential);
        const userId = userCredential.user.uid;
        const userNumber = await this.getUniqueUserNumber();
        const registrationDate = this.getFormattedDate();
        console.log('Generated user number:', userNumber);

        await set(ref(this.db, `members/${userId}`), {
          userNumber,
          username,
          email,
          registrationDate,
          status: 'inactive'
        });
        console.log('User data saved in database.');

        this.openSuccessDialog();
        console.log('Success dialog opened.');
        this.router.navigate(['/profile']);
      } catch (error) {
        this.openErrorDialog();
        console.error('Registration error', error);
      }
    } else {
      console.log('Form is not valid');
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

    return newUserNumber.toString().padStart(6, '0');
  }

  getFormattedDate(): string {
    const timeZone = 'Asia/Bangkok';
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    return format(zonedDate, 'dd/MM/yyyy HH:mm', { locale: th });
  }

  openSuccessDialog(): void {
    this.dialog.open(RegisterSuccessDialogComponent);
  }

  openErrorDialog(): void {
    this.dialog.open(RegisterErrorDialogComponent);
  }
}