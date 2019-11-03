import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SnackMessageService {

  constructor(private snackBar: MatSnackBar) { }

  showError(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar-background-red'];
    config.duration = 5000;
    this.snackBar.open(message, null, config);
  }

  showSuccess(message: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = ['snackbar-background-green'];
    config.duration = 5000;
    this.snackBar.open(message, null, config);
  }
}
