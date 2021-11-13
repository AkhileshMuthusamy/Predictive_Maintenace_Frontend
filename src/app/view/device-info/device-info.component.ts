import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {Observable, of} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {ApiService} from 'src/app/shared/services/api.service';
import {SensorReading, DeviceInfo} from 'src/app/shared/objects/global-objects';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.scss']
})
export class DeviceInfoComponent implements OnInit, AfterViewInit {

  isLoading = false;
  isSensorReadingsLoading = false;
  deviceId: string;
  // To start value from 1
  // sensorsList = [...Array(2).keys()].map((x) => x + 1);
  sensorsList = [...Array(21).keys()];
  displayedColumns: string[] = [
    'sn_1',
    'sn_2',
    'sn_3',
    'sn_4',
    'sn_5',
    'sn_6',
    'sn_7',
    'sn_8',
    'sn_9',
    'sn_10',
    'sn_11',
    'sn_12',
    'sn_13',
    'sn_14',
    'sn_15',
    'sn_16',
    'sn_17',
    'sn_18',
    'sn_19',
    'sn_20',
    'sn_21',
    'rul'];
  dataSource = new MatTableDataSource<any>([]);
  dataLoading$: Observable<boolean> = of(false);
  totalLength = 0;

  xAxis = [];
  predGraph: any;
  sensorGraph: any;

  deviceInfo: DeviceInfo;

  sensorReadingsView = 1;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.deviceId = params.id;
        this.loadDeviceInfo();
        this.loadSensorReadings();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadDeviceInfo(): void {
    if (this.deviceId) {
      this.isLoading = true;
      this.apiService.getDeviceInfo(this.deviceId).subscribe(response => {
        this.isLoading = false;
        if (response.data.length > 0) {
          this.deviceInfo = response.data[0];
        }
      }, () => {
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
    }
  }

  loadSensorReadings(): void {
    this.dataLoading$ = of(true);
    this.isSensorReadingsLoading = true;
    this.apiService.fetchSensorValues(this.deviceId).subscribe(response => {
      this.dataLoading$ = of(false);
      this.isSensorReadingsLoading = false;
      if (!response.error) {
        this.dataSource.data = response.data;
        this.totalLength = response.data.length;
        this.xAxis = [...Array(this.totalLength).keys()].map((x) => x + 1);
        this.generateGraphData(response.data);
        this.parsePredictionData(response.data);
      }
    }, () => {
     this.dataLoading$ = of(false);
     this.isSensorReadingsLoading = false;
    }, () => {
     this.dataLoading$ = of(false);
     this.isSensorReadingsLoading = false;
    });
  }

  parsePredictionData(sensorReadings: [SensorReading]): any {
    const pred = [];
    for (const sensorReading of sensorReadings) {
      pred.push(sensorReading.rul);
    }

    this.predGraph = {
      data: [
          {
            x: this.xAxis,
            y: pred,
            type: 'scatter', mode: 'lines+points',
            marker: {color: 'red'}
          },
      ],
      layout: { height: 240, title: 'Predictions'}
    };

    console.log(this.predGraph);
  }

  generateGraphData(sensorReadings: [SensorReading]): any {
    const graphData = [];
    const sn: Array<Array<number>> = [];
    for (const sensorGraph of this.sensorsList) {
      sn[sensorGraph] = [];
    }

    for (const sensorReading of sensorReadings) {
      for (const sensorGraph of this.sensorsList) {
        sn[sensorGraph].push(sensorReading['sn_' + (sensorGraph + 1)]);
      }

    }

    for (const sensorGraph of this.sensorsList) {
      graphData[sensorGraph] = {
        data: [
            {
              x: this.xAxis,
              y: sn[sensorGraph],
              type: 'scatter', mode: 'lines+points',
              marker: {color: 'orange'}
            },
        ],
        layout: { height: 240, title: 'Sensor ' + (sensorGraph + 1)}
      };
    }

    console.log(graphData);
    this.sensorGraph = graphData;
  }


  updateSensorReadingsView(value: number): void {
    this.sensorReadingsView = value;
  }

}
