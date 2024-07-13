import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Auth, signOut } from '@angular/fire/auth';
import { Database, ref, get, set } from '@angular/fire/database';
import { Storage, ref as storageRef, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData: any = null;
  profileImageUrl: string = 'https://via.placeholder.com/150';

  constructor(
    private auth: Auth,
    private db: Database,
    private storage: Storage,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.loadUserData(user.uid);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  async loadUserData(userId: string): Promise<void> {
    const userRef = ref(this.db, `members/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      this.userData = snapshot.val();
      if (this.userData.profileImageUrl) {
        this.profileImageUrl = this.userData.profileImageUrl;
      }
    } else {
      console.log("No user data available");
    }
  }

  async onFileSelected(event: any): Promise<void> {
    const file: File = event.target.files[0];
    if (file) {
      const user = this.auth.currentUser;
      if (user) {
        const filePath = `profile_pictures/${user.uid}/${file.name}`;
        const fileRef = storageRef(this.storage, filePath);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        this.profileImageUrl = downloadURL;
        await set(ref(this.db, `members/${user.uid}/profileImageUrl`), downloadURL);
      } else {
        console.log("User is not authenticated.");
      }
    }
  }

  getFullName(): string {
    const { prefix, firstName, lastName } = this.userData || {};
    if (firstName || lastName) {
      return `${prefix ? prefix + ' ' : ''}${firstName || ''} ${lastName || ''}`.trim();
    }
    return '';
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  navigateToPersonalInfo() {
    // ทำการนำทางไปยังหน้าข้อมูลส่วนตัว
    // this.router.navigate(['/personal-info']);
  }

  navigateToReferralLink() {
    // ทำการนำทางไปยังหน้า Link สมัครสมาชิก
    // this.router.navigate(['/referral-link']);
  }

  navigateToShopping() {
    // ทำการนำทางไปยังหน้า Link Shopping
    // this.router.navigate(['/shopping']);
  }

  navigateToWithdraw() {
    // ทำการนำทางไปยังหน้าถอนเงิน
    // this.router.navigate(['/withdraw']);
  }
}