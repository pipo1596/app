import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UniformsRoutingModule } from './uniforms-routing.module';
import { UniformComponent } from './uniform/uniform.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerComponent } from './customer/customer.component';

@NgModule({
  declarations: [
    UniformComponent,
    DashboardComponent,
    AccountComponent,
    CustomersComponent,
    CustomerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UniformsRoutingModule,
    AngularEditorModule
  ]
})
export class UniformsModule { }
