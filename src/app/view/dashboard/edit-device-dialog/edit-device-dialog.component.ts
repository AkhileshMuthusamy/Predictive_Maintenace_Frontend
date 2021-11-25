import {Component, OnInit, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from 'src/app/shared/services/api.service';
import {NewDeviceDialogComponent} from '../new-device-dialog/new-device-dialog.component';
import {DeviceInfo} from 'src/app/shared/objects/global-objects';

@Component({
  selector: 'app-edit-device-dialog',
  templateUrl: './edit-device-dialog.component.html',
  styleUrls: ['./edit-device-dialog.component.scss']
})
export class EditDeviceDialogComponent implements OnInit {

  editDeviceForm: FormGroup;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<NewDeviceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeviceInfo,
    private fb: FormBuilder) {
      this.editDeviceForm = this.fb.group({
        id: [this.data.deviceId],
        name: [this.data.name, [Validators.required]],
      });
    }

  ngOnInit(): void {
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.editDeviceForm.controls[controlName];
    if (!control) {
      return false;
    }

    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  submit(): void {
    this.isLoading = true;
    this.apiService.editDevice(this.editDeviceForm.value).subscribe(response => {
      if (!response.error) {
        this.snackBar.open(response.message || 'Device updated successfully!', 'Close', {duration: 2000});
        this.dialogRef.close();
      } else {
        this.snackBar.open(response.message, 'Close', {duration: 2000});
      }
    }, () => {
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

}
