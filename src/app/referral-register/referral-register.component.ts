import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Database, ref, set, get } from '@angular/fire/database';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-referral-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './referral-register.component.html',
  styleUrls: ['./referral-register.component.css']
})

export class ReferralRegisterComponent implements OnInit {
  registerForm: FormGroup;
  referralCode: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private db: Database,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      prefix: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      birthdate: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      facebookName: [''],
      lineId: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.referralCode = params['referralCode'];
      this.checkReferralCode();
    });
  }

  async checkReferralCode() {
    const referrerRef = ref(this.db, `members/${this.referralCode}`);
    const snapshot = await get(referrerRef);
    if (!snapshot.exists()) {
      this.snackBar.open('Invalid referral code', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
    }
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const { email, password } = this.registerForm.value;
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        const userId = userCredential.user.uid;
        const userNumber = await this.getUniqueUserNumber();
        const registrationDate = this.getFormattedDate();
        const age = this.calculateAge(this.registerForm.value.birthdate);

        await set(ref(this.db, `members/${userId}`), {
          ...this.registerForm.value,
          userNumber,
          registrationDate,
          age,
          referredBy: this.referralCode,
          status: 'inactive'
        });

        this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Registration error', error);
        this.snackBar.open('Registration failed', 'Close', { duration: 3000 });
      }
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
    return `DV${newUserNumber.toString().padStart(6, '0')}`;
  }

  getFormattedDate(): string {
    const timeZone = 'Asia/Bangkok';
    const now = new Date();
    const zonedDate = toZonedTime(now, timeZone);
    return format(zonedDate, 'dd/MM/yyyy HH:mm', { locale: th });
  }

  calculateAge(birthdate: string): number {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}