import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { UniformComponent } from './uniform/uniform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './uniform/account/account.component';

const routes: Routes = [
  { path: 'newuniform', component: UniformComponent },
  { path: 'dashboard/:nhno', component: DashboardComponent },
  { path: 'account', component: AccountComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniformsRoutingModule { }
