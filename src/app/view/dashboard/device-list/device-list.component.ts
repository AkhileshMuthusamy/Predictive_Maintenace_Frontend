import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import {DeviceInfo, Settings} from 'src/app/shared/objects/global-objects';
import {ApiService} from 'src/app/shared/services/api.service';
import {DataService} from 'src/app/shared/services/data.service';
import {EditDeviceDialogComponent} from '../edit-device-dialog/edit-device-dialog.component';
import {NewDeviceDialogComponent} from '../new-device-dialog/new-device-dialog.component';
import {PlotlyComponent} from 'angular-plotly.js';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['name', 'rul', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  isDeviceListLoading = false;
  showPlot = true;
  totalLength = 0;
  threshold = 50;

  barGraph = {
    data: [
      {
        x: [],
        y: [],
        name: 'Cycles Ran',
        type: 'bar',
        marker: {color: 'rgba(0,189,174,255)'}
      },
      {
        x: [],
        y: [],
        name: 'Remaining Life',
        type: 'bar',
        marker: {color: 'rgba(222,45,38,0.8)'}
      }
    ],
    layout: {
      barmode: 'stack',
      title: 'Overall Performance',
      xaxis: {
        tickangle: -45
      },
    }
  };

  $subscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(PlotlyComponent) plotly: PlotlyComponent;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private apiService: ApiService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.$subscription = this.dataService.getSettings().subscribe((settings: Settings | null) => {
      if (settings) {
        this.threshold = settings.threshold;
        this.loadDeviceList();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  navigate(device: DeviceInfo): void {
    const path = ['/device', device.deviceId];
    this.router.navigate(path).then(() => {});
  }

  loadDeviceList(): void {
    this.isDeviceListLoading = true;
    this.apiService.getDeviceList().subscribe(response => {
      this.isDeviceListLoading = false;
      if (!response.error) {
        this.dataSource.data = response.data;
        this.totalLength = response.data.length;
        this.loadBarGraph(response.data);
      }
    }, () => {
     this.isDeviceListLoading = false;
    }, () => {
     this.isDeviceListLoading = false;
    });
  }

  openAddNewDeviceDialog(): void {
    const dialogRef = this.dialog.open(NewDeviceDialogComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadDeviceList();
    });
  }

  openEditDeviceDialog(row): void {
    const dialogRef = this.dialog.open(EditDeviceDialogComponent, {
      width: '450px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadDeviceList();
    });
  }

  loadBarGraph(deviceInfos: [DeviceInfo]): void {

    const xBar = [];
    const yCyclesRan = [];
    const yRUL = [];

    for (const deviceInfo of deviceInfos) {
      xBar.push(deviceInfo.name);
      yCyclesRan.push(deviceInfo.cycle_ran);
      yRUL.push(deviceInfo.rul);
    }

    this.barGraph = {
      data: [
        {
          x: xBar,
          y: yCyclesRan,
          name: 'Cycles Ran',
          type: 'bar',
          marker: {color: 'rgba(0,189,174,255)'}
        },
        {
          x: xBar,
          y: yRUL,
          name: 'Remaining Life',
          type: 'bar',
          marker: {color: 'rgba(222,45,38,0.8)'}
        }
      ],
      layout: {
        barmode: 'stack',
        title: 'Overall Performance',
        xaxis: {
          tickangle: -45
        }
      }
    };

    this.redrawPlot();
  }

  redrawPlot(): void {
    this.showPlot = false;
    setTimeout(() => {
      this.showPlot = true;
    }, 50);
  }

}
