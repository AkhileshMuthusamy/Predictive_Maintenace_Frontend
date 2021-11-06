import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {DeviceListComponent} from './device-list/device-list.component';
import {StatsCardComponent} from './stats-card/stats-card.component';


@NgModule({
  declarations: [DashboardComponent, StatsCardComponent, DeviceListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent
      }
    ]),
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class DashboardModule { }
