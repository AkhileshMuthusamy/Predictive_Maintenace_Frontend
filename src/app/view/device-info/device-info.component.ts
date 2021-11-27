import {AfterViewInit, Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute} from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import {DeviceInfo, PredictionGraphData, SensorReading, Settings} from 'src/app/shared/objects/global-objects';
import {ApiService} from 'src/app/shared/services/api.service';
import {DataService} from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.scss']
})
export class DeviceInfoComponent implements OnInit, AfterViewInit, OnDestroy {

  isLoading = false;
  isSensorReadingsLoading = false;
  isPredictionGraphLoading = false;
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
  predictionXAxis = [];
  predGraph: any;
  sensorGraph: any;
  rulGuage: any;
  threshold = 50;
  deviceInfo: DeviceInfo;

  displayPrediction = true;
  sensorReadingsTableView = true;
  displaySpinner = false;
  timeout;

  $subscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public dataService: DataService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.deviceId = params.id;
        this.$subscription = this.dataService.getSettings().subscribe((settings: Settings | null) => {
          if (settings) {
            this.threshold = settings.threshold;
            this.loadDeviceInfo();
            this.loadPredictionGraph();
            this.loadSensorReadings();
          }
        });
      }
    });
  }

  toggleView(): void {
    this.displaySpinner = this.sensorReadingsTableView;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.sensorReadingsTableView = !this.sensorReadingsTableView;
    }, 10);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
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
      }
    }, () => {
     this.dataLoading$ = of(false);
     this.isSensorReadingsLoading = false;
    }, () => {
     this.dataLoading$ = of(false);
     this.isSensorReadingsLoading = false;
    });
  }

  loadPredictionGraph(): void {
    this.isPredictionGraphLoading = true;
    this.apiService.getPredictionGraphData(this.deviceId).subscribe(response => {
      this.isPredictionGraphLoading = false;
      if (!response.error) {
        const totalRulCount = response.data.rul.length;
        this.predictionXAxis = [...Array(totalRulCount).keys()].map((x) => x + 1);
        this.plotPredictionData(response.data);
        const currentRUL = response.data.rul[totalRulCount - 1] || 0;
        const previousRUL = response.data.rul[totalRulCount - 2] || 0;
        this.loadRULGuage(currentRUL, previousRUL);
      }
    }, () => {
     this.isPredictionGraphLoading = false;
    }, () => {
     this.isPredictionGraphLoading = false;
    });
  }

  loadRULGuage(rul: number, previousRUL: number): void {
    this.rulGuage = {
      data: [
        { // https://plotly.com/javascript/gauge-charts/
          domain: { x: [0, 1], y: [0, 1] },
          value: rul,
          title: { text: 'Remaining Life' },
          type: 'indicator',
          mode: 'gauge+number+delta', // gauge+number+delta
          delta: { reference: previousRUL },
          gauge: {
            axis: { range: [null, 150] },
            bar: { color: 'rgb(64,88,103)' },
            steps: [
              { range: [0, this.threshold], color: 'rgba(254,112,88,255)' },
              { range: [this.threshold, 150], color: 'rgb(154, 250, 210)' }
            ],
            // threshold: {
            //   line: { color: 'red', width: 4 },
            //   thickness: 0.75,
            //   value: 490
            // }
          }
        }
      ],
      layout: {  height: 280, margin: { t: 50, b: 10 } }
    };
  }

  plotPredictionData(predictionGraphData: PredictionGraphData): any {

    this.predGraph = {
      data: [
        {
          x: this.predictionXAxis,
          y: [...Array(this.predictionXAxis.length).keys()].map((x) => this.threshold),
          fill: 'tozeroy', // https://plotly.com/javascript/filled-area-plots/
          // fillcolor: '#f5b4b0', // https://plotly.com/javascript/reference/contour/#contour-fillcolor
          type: 'scatter',
          mode: 'line',
          marker: {color: 'rgb(224, 241, 248)'},
          hoverinfo: 'skip',
          name: 'Threshold'
        },
        {
          x: this.predictionXAxis,
          y: predictionGraphData.rul,
          type: 'scatter',
          mode: 'lines+points',
          name: 'Raw (Remaining Life)',
          marker: {color: '#17BECF'}
        },
        {
          x: this.predictionXAxis,
          y: predictionGraphData.smoothRul,
          type: 'scatter',
          mode: 'lines+points',
          name: 'Smoothed (Remaining Life) ',
          marker: {color: '#7F7F7F'}
        },

      ],
      layout: {
        height: 340,
        title: 'Predictions',
        xaxis: {
          title: 'Cycles Ran',
        },
        yaxis: {
          title: 'Remaining Life',
        },
        legend: {
          // orientation: 'h',
          x: 1,
          y: 1,
          yanchor: 'bottom',
          xanchor: 'right',
          // bgcolor: 'LightSteelBlue',
          // bordercolor: 'Black',
          // borderwidth: 1
        },
        hovermode: 'x unified'
      }
    };
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
              marker: {color: 'rgb(34, 162, 93)'}
            },
        ],
        layout: {
          height: 240,
          title: {
            text: 'SENSOR ' + (sensorGraph + 1),
            font: {
              size: 20
            }
          },
          xaxis: {
            title: 'Cycles Ran',
          },
          yaxis: {
            title: 'Sensor Output',
          },
          hovermode: 'x unified',
          plot_bgcolor: 'rgb(245, 248, 248)',
          paper_bgcolor: 'rgba(242, 248, 246, 5)'
        }
      };
    }

    this.sensorGraph = graphData;
  }

  whenGraphInitialized(): void {
    this.displaySpinner = false;
  }

}
