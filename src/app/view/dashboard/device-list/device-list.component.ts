import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {ApiService} from 'src/app/shared/services/api.service';
import {DeviceInfo} from 'src/app/shared/objects/global-objects';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'rul', 'status'];
  dataSource = new MatTableDataSource<any>([]);
  dataLoading$: Observable<boolean> = of(false);
  totalLength = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDeviceList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
      }
    }, () => {
     this.dataLoading$ = of(false);
    }, () => {
     this.dataLoading$ = of(false);
    });
  }

}
