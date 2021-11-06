import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../shared/services/api.service';
import {DashboardStat} from 'src/app/shared/objects/global-objects';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {

  isLoading = false;
  dashboard: DashboardStat;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
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
    });
  }

}
