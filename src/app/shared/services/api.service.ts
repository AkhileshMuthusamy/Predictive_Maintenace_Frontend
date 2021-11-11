import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {APIResponse} from '../objects/api-response';
import {DashboardStat, DeviceInfo, SensorReading} from '../objects/global-objects';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly apiURL: string;

  constructor(private httpClient: HttpClient) {
    this.apiURL = environment.apiURL;
  }

  getDashboardStats(): Observable<APIResponse<DashboardStat>> {
    return this.httpClient.get<APIResponse<DashboardStat>>(`${this.apiURL}dashboard-stats`);
  }

  getDeviceList(): Observable<APIResponse<[DeviceInfo]>> {
    return this.httpClient.get<APIResponse<[DeviceInfo]>>(`${this.apiURL}list/device`);
  }

  addNewDevice(formData): Observable<APIResponse<null>> {
    return this.httpClient.post<APIResponse<null>>(`${this.apiURL}/device`, formData);
  }

  fetchSensorValues(deviceId: string): Observable<APIResponse<[SensorReading]>> {
    return this.httpClient.get<APIResponse<[SensorReading]>>(`${this.apiURL}device/reading?id=${deviceId}`);
  }

}
