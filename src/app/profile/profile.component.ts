import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Auth } from '@angular/fire/auth';
import { Database, ref, get } from '@angular/fire/database';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = null;

  constructor(private auth: Auth, private db: Database) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.loadUserData(user.uid);
      }
    });
  }

  async loadUserData(userId: string): Promise<void> {
    const userRef = ref(this.db, `members/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      this.userData = snapshot.val();
    } else {
      console.log("No user data available");
    }
  }
}
