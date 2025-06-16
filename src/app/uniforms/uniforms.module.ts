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
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './note/note.component';
import { CategoriesComponent } from './categories/categories.component';
import { NaChildComponent } from './categories/na-child/na-child.component';

@NgModule({
  declarations: [
    UniformComponent,
    DashboardComponent,
    AccountComponent,
    CustomersComponent,
    CustomerComponent,
    NotesComponent,
    NoteComponent,
    CategoriesComponent,
    NaChildComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UniformsRoutingModule,
    AngularEditorModule
  ]
})
export class UniformsModule { }
