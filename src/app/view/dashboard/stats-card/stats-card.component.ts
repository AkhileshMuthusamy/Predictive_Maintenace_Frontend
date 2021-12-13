import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {DashboardStat, Settings} from 'src/app/shared/objects/global-objects';
import {Subscription} from 'rxjs';
import {DataService} from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {

  isLoading = false;
  dashboard: DashboardStat;
  threshold = 50;

  $subscription: Subscription;

  constructor(private apiService: ApiService, private dataService: DataService) { }

  ngOnInit(): void {
    this.$subscription = this.dataService.getSettings().subscribe((settings: Settings | null) => {
      if (settings) {
        this.threshold = settings.threshold;
        this.loadDeviceList();
      }
    });
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoading = true;
    this.apiService.getDashboardStats().subscribe(response => {
      this.isLoading = false;
      if (!response.error) {
        this.dashboard = response.data;
      }
    }, () => {
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
      this.loadDeviceList();
    });
  }

  loadDeviceList(): void {
    this.apiService.getDeviceList().subscribe(response => {
      if (!response.error) {
        let goodDevice = 0;
        let badDevice = 0;
        const dt = response.data;
        for (const d of dt) {
          if (d.rul > this.threshold) {
            goodDevice += 1;
          } else {
            badDevice += 1;
          }
        }
        this.dashboard.goodCondition = goodDevice;
        this.dashboard.needMaintenance = badDevice;
      }
    }, () => {
    }, () => {
    });
  }

}
