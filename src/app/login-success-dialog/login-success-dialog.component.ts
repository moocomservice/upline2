import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-success-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './login-success-dialog.component.html',
  styleUrls: ['./login-success-dialog.component.css']
})
export class LoginSuccessDialogComponent {
  constructor(public dialogRef: MatDialogRef<LoginSuccessDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
