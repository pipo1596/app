import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UniformsRoutingModule } from './uniforms-routing.module';
import { UniformComponent } from './uniform/uniform.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerComponent } from './customer/customer.component';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './note/note.component';
import { CategoriesComponent } from './categories/categories.component';
import { NaChildComponent } from './categories/na-child/na-child.component';
import { CategoryComponent } from './category/category.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { ProductsComponent } from './products/products.component';
import { UplistComponent } from './uplist/uplist.component';
import { VaspriceComponent } from './vasprice/vasprice.component';
import { ImagesComponent } from './images/images.component';
import { ImageComponent } from './image/image.component';
import { IframeComponent } from './iframe/iframe.component';
import { OERP52Component } from './reports/oerp52/oerp52.component';
import { OERP53Component } from './reports/oerp53/oerp53.component';
import { ExportComponent } from './export/export.component';
import { CxmlConfigsComponent } from './cxml-configs/cxml-configs.component';
import { CxmlCustomersComponent } from './cxml-customers/cxml-customers.component';
import { CxmlCustomerComponent } from './cxml-customer/cxml-customer.component';
import { OERP302Component } from './reports/oerp302/oerp302.component';
import { CxmlCategoriesComponent } from './cxml-categories/cxml-categories.component';
import { ImportComponent } from './import/import.component';
import { OEUL22Component } from './uploads/oeul22/oeul22.component';
import { OEUL36Component } from './uploads/oeul36/oeul36.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ProductComponent } from './product/product.component';
import { CustomizationsComponent } from './customizations/customizations.component';
import { CustomizationComponent } from './customization/customization.component';

@NgModule({
  declarations: [
    UniformComponent,
    DashboardComponent,
    CustomersComponent,
    CustomerComponent,
    NotesComponent,
    NoteComponent,
    CategoriesComponent,
    NaChildComponent,
    CategoryComponent,
    ProductsComponent,
    UplistComponent,
    VaspriceComponent,
    ImagesComponent,
    ImageComponent,
    IframeComponent,
    OERP52Component,
    OERP53Component,
    ExportComponent,
    CxmlConfigsComponent,
    CxmlCustomersComponent,
    CxmlCustomerComponent,
    OERP302Component,
    CxmlCategoriesComponent,
    ImportComponent,
    OEUL22Component,
    OEUL36Component,
    WarehouseComponent,
    ProductComponent,
    CustomizationsComponent,
    CustomizationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UniformsRoutingModule,
    AngularEditorModule,
    SelectDropDownModule
  ]
})
export class UniformsModule { }
