import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-success-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './register-success-dialog.component.html',
  styleUrls: ['./register-success-dialog.component.css']
})
export class RegisterSuccessDialogComponent {
  constructor(public dialogRef: MatDialogRef<RegisterSuccessDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
