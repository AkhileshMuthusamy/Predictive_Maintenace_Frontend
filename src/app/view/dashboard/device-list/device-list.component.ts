import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.dataSource.data = [{id: 1, name: 'D1', rul: 3, status: 1}];
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  navigate(device): void {

    console.log(device);

    const path = ['/device', device.id];

    this.router.navigate(path).then(() => {});
  }

}
