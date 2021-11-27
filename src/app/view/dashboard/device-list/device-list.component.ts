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

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['name', 'rul', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  dataLoading$: Observable<boolean> = of(false);
  totalLength = 0;
  threshold = 50;

  $subscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    this.dataLoading$ = of(true);
    this.apiService.getDeviceList().subscribe(response => {
      this.dataLoading$ = of(false);
      if (!response.error) {
        this.dataSource.data = response.data;
        this.totalLength = response.data.length;
      }
    }, () => {
     this.dataLoading$ = of(false);
    }, () => {
     this.dataLoading$ = of(false);
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

}
