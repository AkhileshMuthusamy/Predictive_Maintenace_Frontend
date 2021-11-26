import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from 'src/app/shared/services/api.service';
import {DataService} from 'src/app/shared/services/data.service';
import {DateService} from 'src/app/shared/services/date.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup;
  isLoading = false;

  constructor(
    private apiService: ApiService,
    private dateService: DateService,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder) {
      this.settingsForm = this.fb.group({
        id: [null],
        threshold: [0, [Validators.required, Validators.pattern('[0-9]*')]],
        date: [''],
      });
    }

  ngOnInit(): void {
    this.loadSettings();
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.settingsForm.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  loadSettings(): void {
    this.isLoading = true;
    this.apiService.getSettings().subscribe(response => {
      if (!response.error) {
        this.settingsForm.controls.id.setValue(response.data._id.$oid);
        this.settingsForm.controls.threshold.setValue(response.data.threshold);
        this.settingsForm.controls.date.setValue(this.dateService.getDateString(response.data.last_updated.$date));
      } else {
        this.snackBar.open(response.message, 'Close', {duration: 2000});
      }
    }, () => {
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  update(): void {
    this.isLoading = true;
    this.apiService.updateSettings(this.settingsForm.getRawValue()).subscribe(response => {
      if (!response.error) {
        this.snackBar.open(response.message || 'Updated successfully', 'Close', {duration: 2000});
        this.loadSettings();
        this.dataService.loadSettings();
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
