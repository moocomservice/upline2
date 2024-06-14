import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-error-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './register-error-dialog.component.html',
  styleUrls: ['./register-error-dialog.component.css']
})
export class RegisterErrorDialogComponent {
  constructor(public dialogRef: MatDialogRef<RegisterErrorDialogComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
