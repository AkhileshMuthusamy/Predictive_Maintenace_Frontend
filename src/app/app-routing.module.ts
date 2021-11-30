import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {DeviceInfoComponent} from './view/device-info/device-info.component';
import {PredictComponent} from './view/predict/predict.component';
import {SettingsComponent} from './view/settings/settings.component';
import {HomeComponent} from './view/home/home.component';


const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'dashboard',
        loadChildren: () => import ('../app/view/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'device/:id',
        component: DeviceInfoComponent
      },
      {
        path: 'predict',
        component: PredictComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
