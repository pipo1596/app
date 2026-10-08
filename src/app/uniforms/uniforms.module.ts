import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UniformsRoutingModule } from './uniforms-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { UniformComponent } from './uniform/uniform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CustomersComponent } from './customers/customers.component';
import { NotesComponent } from './notes/notes.component';
import { ImagesComponent } from './images/images.component';
import { UplistComponent } from './uplist/uplist.component';
import { VaspriceComponent } from './vasprice/vasprice.component';
import { CustomerComponent } from './customer/customer.component';
import { NoteComponent } from './note/note.component';
import { NaChildComponent } from './categories/na-child/na-child.component';
import { CustomizationsComponent } from './customizations/customizations.component';
import { CustomizationComponent } from './customization/customization.component';
import { ImageComponent } from './image/image.component';
import { IframeComponent } from './iframe/iframe.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { CxmlConfigsComponent } from './cxml-configs/cxml-configs.component';
import { CxmlCustomersComponent } from './cxml-customers/cxml-customers.component';
import { OERP52Component } from './reports/oerp52/oerp52.component';
import { OERP53Component } from './reports/oerp53/oerp53.component';
import { OEUL36Component } from './uploads/oeul36/oeul36.component';
import { OEUL22Component } from './uploads/oeul22/oeul22.component';
import { CxmlCategoriesComponent } from './cxml-categories/cxml-categories.component';
import { CxmlCustomerComponent } from './cxml-customer/cxml-customer.component';
import { OERP302Component } from './reports/oerp302/oerp302.component';
import { VasApplicationsComponent } from './vas-applications/vas-applications.component';
import { VasApplicationComponent } from './vas-application/vas-application.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { MassQuestionComponent } from './mass-question/mass-question.component';
import { MassItemComponent } from './mass-item/mass-item.component';
import { MassAppComponent } from './mass-app/mass-app.component';
import { VasQuestionsComponent } from './vas-questions/vas-questions.component';
import { VasQuestionComponent } from './vas-question/vas-question.component';
import { AuditComponent } from './audit/audit.component';
import { InfoComponent } from './info/info.component';
import { QuickAddComponent } from './quick-add/quick-add.component';
import { OverridesComponent } from './overrides/overrides.component';
import { OverrideComponent } from './override/override.component';
import { ModalImfComponent } from './modal-imf/modal-imf.component';
import { ItemImagesComponent } from './item-images/item-images.component';
import { ItemImageComponent } from './item-image/item-image.component';
import { MassappDeleteComponent } from './massapp-delete/massapp-delete.component';
import { MassappAddComponent } from './massapp-add/massapp-add.component';
import { MassappUpdateComponent } from './massapp-update/massapp-update.component';
import { SamtrackComponent } from './samtrack/samtrack.component';
import { SamgroupComponent } from './samgroup/samgroup.component';
import { UniformLayoutComponent } from './uniform-layout/uniform-layout.component';
import { SamauditComponent } from './samaudit/samaudit.component';

@NgModule({
  declarations: [
    UniformComponent,
    DashboardComponent,
    ProductsComponent,
    ProductComponent,
    CategoriesComponent,
    CategoryComponent,
    CustomersComponent,
    NotesComponent,
    ImagesComponent,
    UplistComponent,
    VaspriceComponent,
    CustomerComponent,
    NoteComponent,
    NaChildComponent,
    CustomizationsComponent,
    CustomizationComponent,
    ImageComponent,
    IframeComponent,
    ImportComponent,
    ExportComponent,
    CxmlConfigsComponent,
    CxmlCustomersComponent,
    OERP52Component,
    OERP53Component,
    OEUL36Component,
    OEUL22Component,
    CxmlCategoriesComponent,
    CxmlCustomerComponent,
    OERP302Component,
    VasApplicationsComponent,
    VasApplicationComponent,
    WarehouseComponent,
    MassQuestionComponent,
    MassItemComponent,
    MassAppComponent,
    VasQuestionsComponent,
    VasQuestionComponent,
    AuditComponent,
    InfoComponent,
    QuickAddComponent,
    OverridesComponent,
    OverrideComponent,
    ModalImfComponent,
    ItemImagesComponent,
    ItemImageComponent,
    MassappDeleteComponent,
    MassappAddComponent,
    MassappUpdateComponent,
    SamtrackComponent,
    SamgroupComponent,
    UniformLayoutComponent,
    SamauditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UniformsRoutingModule,
    AngularEditorModule,
    SelectDropDownModule,
  ]
})
export class UniformsModule { }
