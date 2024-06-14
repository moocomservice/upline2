import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login-error-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './login-error-dialog.component.html',
  styleUrls: ['./login-error-dialog.component.css']
})
export class LoginErrorDialogComponent {
  constructor(public dialogRef: MatDialogRef<LoginErrorDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
