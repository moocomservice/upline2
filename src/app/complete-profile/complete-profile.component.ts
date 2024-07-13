import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; // Add this import
import { Auth } from '@angular/fire/auth';
import { Database, ref, update } from '@angular/fire/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule, // Add this to the imports array
  ],
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.css']
})
export class CompleteProfileComponent {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private db: Database,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      const user = this.auth.currentUser;
      if (user) {
        const userRef = ref(this.db, `members/${user.uid}`);
        try {
          await update(userRef, {
            username: this.profileForm.value.username
          });
          this.router.navigate(['/profile']);
        } catch (error) {
          console.error('Error updating username:', error);
          // Handle error (e.g., show error message to user)
        }
      }
    }
  }
}