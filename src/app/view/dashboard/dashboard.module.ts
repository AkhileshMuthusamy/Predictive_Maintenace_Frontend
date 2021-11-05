import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import { StatsCardComponent } from './stats-card/stats-card.component';



@NgModule({
  declarations: [DashboardComponent, StatsCardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent
      }
    ]),
    FlexLayoutModule
  ]
})
export class DashboardModule { }
