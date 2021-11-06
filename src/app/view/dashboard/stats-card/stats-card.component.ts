import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent implements OnInit {

  isLoading = false;
  dashboard = null;

  constructor() { }

  ngOnInit(): void {
    this.dashboard = {
      totalDevices: 2,
      goodCondition: 1,
      needMaintenance: 1
    };
  }

}
