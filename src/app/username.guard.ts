import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Database, ref, get } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UsernameGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private db: Database,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (user) {
      const userRef = ref(this.db, `members/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (!userData.username) {
          this.router.navigate(['/complete-profile']);
          return false;
        }
      }
    }
    return true;
  }
}