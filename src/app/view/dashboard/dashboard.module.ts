import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterModule} from '@angular/router';
import {PlotlyModule} from 'angular-plotly.js';
import * as PlotlyJS from 'plotly.js-dist-min';
import {DashboardComponent} from './dashboard.component';
import {DeviceListComponent} from './device-list/device-list.component';
import {EditDeviceDialogComponent} from './edit-device-dialog/edit-device-dialog.component';
import {NewDeviceDialogComponent} from './new-device-dialog/new-device-dialog.component';
import {StatsCardComponent} from './stats-card/stats-card.component';
import {SharedModule} from '../../shared/shared.module';

PlotlyModule.plotlyjs = PlotlyJS;


@NgModule({
  declarations: [
    DashboardComponent,
    StatsCardComponent,
    DeviceListComponent,
    NewDeviceDialogComponent,
    EditDeviceDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent
      }
    ]),
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatDividerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSortModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    PlotlyModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DashboardModule { }
