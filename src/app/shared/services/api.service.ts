import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {APIResponse} from '../objects/api-response';
import {DashboardStat} from '../objects/global-objects';
import {environment} from '../../../environments/environment'

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
}
