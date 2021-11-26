import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from 'src/app/shared/services/api.service';
import {DataService} from 'src/app/shared/services/data.service';
import {Settings} from 'src/app/shared/objects/global-objects';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settingsForm: FormGroup;
  isLoading = false;

  $subscription: Subscription;

  constructor(
    private apiService: ApiService,
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
    this.subscribeSettings();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.settingsForm.controls[controlName];
    if (!control) {
      return false;
    }
    return control.hasError(validationType) && (control.dirty || control.touched);
  }

  subscribeSettings(): void {
    this.$subscription = this.dataService.getSettings().subscribe((settings: Settings | null) => {
      if (settings) {
        this.settingsForm.setValue(settings);
      }
    });
  }

  update(): void {
    this.isLoading = true;
    this.apiService.updateSettings(this.settingsForm.getRawValue()).subscribe(response => {
      if (!response.error) {
        this.snackBar.open(response.message || 'Updated successfully', 'Close', {duration: 2000});
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
