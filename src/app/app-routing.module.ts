import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainLayoutComponent} from './main-layout/main-layout.component';
import {DeviceInfoComponent} from './view/device-info/device-info.component';


const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadChildren: () => import ('../app/view/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'device/:id',
        component: DeviceInfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
