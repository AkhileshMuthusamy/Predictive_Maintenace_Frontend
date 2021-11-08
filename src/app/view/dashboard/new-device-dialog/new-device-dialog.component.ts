import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-new-device-dialog',
  templateUrl: './new-device-dialog.component.html',
  styleUrls: ['./new-device-dialog.component.scss']
})
export class NewDeviceDialogComponent implements OnInit {

  newDeviceForm: FormGroup;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
      this.newDeviceForm = this.fb.group({
        device_name: ['', [Validators.required]],
      });
    }

  ngOnInit(): void {
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.newDeviceForm.controls[controlName];
    if (!control) {
      return false;
    }

    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  submit(): void {
    this.isLoading = true;
  }

}
