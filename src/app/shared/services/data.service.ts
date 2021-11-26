import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from './api.service';
import {DateService} from './date.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Settings} from '../objects/global-objects';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private $isSettingsLoading: boolean;

  private settings = new BehaviorSubject<Settings>(null);

  constructor(private apiService: ApiService, private dateService: DateService, private snackBar: MatSnackBar) {
    this.loadSettings();
  }

  get isSettingsLoading(): boolean {
    return this.$isSettingsLoading;
  }

  public getSettings(): Observable<Settings> {
    return this.settings.asObservable();
  }


  loadSettings(): void {
    this.$isSettingsLoading = true;
    this.apiService.getSettings().subscribe(response => {
      if (!response.error) {
        const settingsData: Settings = {
          id: null,
          threshold: 0,
          date: ''
        };
        settingsData.id = response.data._id.$oid;
        settingsData.threshold = response.data.threshold;
        settingsData.date = this.dateService.getDateString(response.data.last_updated.$date);
        this.settings.next(settingsData);

      } else {
        this.snackBar.open(response.message, 'Close', {duration: 2000});
      }
    }, () => {
      this.$isSettingsLoading = false;
    }, () => {
      this.$isSettingsLoading = false;
    });
  }
}
