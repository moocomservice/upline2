import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CompleteProfileComponent } from './complete-profile/complete-profile.component';
import { ReferralRegisterComponent } from './referral-register/referral-register.component';
import { UsernameGuard } from './username.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'complete-profile', component: CompleteProfileComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [UsernameGuard] },
  { path: 'refer/:referralCode', component: ReferralRegisterComponent },
  { path: '**', redirectTo: '/login' } // For any undefined routes, redirect to /login
];