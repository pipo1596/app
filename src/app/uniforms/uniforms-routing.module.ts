import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { UniformComponent } from './uniform/uniform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerComponent } from './customer/customer.component';
import { NotesComponent } from './notes/notes.component';

const routes: Routes = [
  { path: 'newuniform', component: UniformComponent },
  { path: 'newuniform/:acno', component: UniformComponent },
  { path: 'dashboard/:nhno', component: DashboardComponent },
  { path: 'account', component: AccountComponent },
  { path: 'customers/:nhno', component: CustomersComponent },
  { path: 'newcustomer/:nhno', component: CustomerComponent },
  { path: 'newcustomer/:nhno/:acno', component: CustomerComponent },
  { path: 'editcustomer/:nhno/:acno', component: CustomerComponent },
  { path: 'notes/:nhno', component: NotesComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniformsRoutingModule { }
