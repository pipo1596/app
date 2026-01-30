import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UniformComponent } from './uniform/uniform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InfoComponent } from './info/info.component';
import { ProductsComponent } from './products/products.component';
import { ProductComponent } from './product/product.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerComponent } from './customer/customer.component';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './note/note.component';
import { ImagesComponent } from './images/images.component';
import { ImageComponent } from './image/image.component';
import { UplistComponent } from './uplist/uplist.component';
import { VaspriceComponent } from './vasprice/vasprice.component';
import { CustomizationsComponent } from './customizations/customizations.component';
import { CustomizationComponent } from './customization/customization.component';
import { VasApplicationsComponent } from './vas-applications/vas-applications.component';
import { VasApplicationComponent } from './vas-application/vas-application.component';
import { VasQuestionComponent } from './vas-question/vas-question.component';
import { MassAppComponent } from './mass-app/mass-app.component';
import { MassItemComponent } from './mass-item/mass-item.component';
import { MassQuestionComponent } from './mass-question/mass-question.component';
import { IframeComponent } from './iframe/iframe.component';
import { ImportComponent } from './import/import.component';
import { ExportComponent } from './export/export.component';
import { CxmlConfigsComponent } from './cxml-configs/cxml-configs.component';
import { CxmlCustomersComponent } from './cxml-customers/cxml-customers.component';
import { CxmlCustomerComponent } from './cxml-customer/cxml-customer.component';
import { CxmlCategoriesComponent } from './cxml-categories/cxml-categories.component';
import { OEUL22Component } from './uploads/oeul22/oeul22.component';
import { OEUL36Component } from './uploads/oeul36/oeul36.component';
import { OERP52Component } from './reports/oerp52/oerp52.component';
import { OERP53Component } from './reports/oerp53/oerp53.component';
import { OERP302Component } from './reports/oerp302/oerp302.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { AuditComponent } from './audit/audit.component';
import { QuickAddComponent } from './quick-add/quick-add.component';
import { OverridesComponent } from './overrides/overrides.component';
import { OverrideComponent } from './override/override.component';
import { ItemImagesComponent } from './item-images/item-images.component';
import { ItemImageComponent } from './item-image/item-image.component';
import { ModalImfComponent } from './modal-imf/modal-imf.component';
import { MassappAddComponent } from './massapp-add/massapp-add.component';
import { MassappDeleteComponent } from './massapp-delete/massapp-delete.component';
import { MassappUpdateComponent } from './massapp-update/massapp-update.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  //Uniform
  { path: 'newuniform', component: UniformComponent  },
  { path: 'newuniform/:acno', component: UniformComponent, canActivate: [authGuard]  },

  //Dashboard
  { path: 'dashboard/:nhno', component: DashboardComponent},
  { path: 'upname/:nhno', component: InfoComponent, canActivate: [authGuard]},
  { path: 'upeffd/:nhno', component: InfoComponent, canActivate: [authGuard]},
  { path: 'upexpd/:nhno', component: InfoComponent, canActivate: [authGuard]},

  //Products
  { path: 'products/:nhno', component: ProductsComponent, canActivate: [authGuard]  }, //Products LM
  { path: 'products/:nhno/:styl', component: ProductsComponent, canActivate: [authGuard]  }, //Products LM
  { path: 'product/:nhno/:nino', component: ProductComponent, canActivate: [authGuard] }, //Editing Product
  { path: 'product/:nhno/:nino/:styl', component: ProductComponent, canActivate: [authGuard]  }, //Editing Product + Selected Item
  { path: 'newproduct/:nhno', component: ProductComponent, canActivate: [authGuard]  }, //Creating Product
  { path: 'newproduct/:nhno/:styl', component: ProductComponent, canActivate: [authGuard]  }, //Creating Product + Selected Item

  //Product Images
  { path: 'overrides/:nhno/:nino', component: OverridesComponent, canActivate: [authGuard] }, 
  { path: 'override/:nhno/:nino', component: OverrideComponent, canActivate: [authGuard] }, 
  { path: 'modalimf/:nhno/:nino', component: ModalImfComponent, canActivate: [authGuard] }, 
  { path: 'itemimages/:nhno/:nino', component: ItemImagesComponent, canActivate: [authGuard] }, 
  { path: 'itemimage/:nhno/:nino', component: ItemImageComponent, canActivate: [authGuard] }, 
  { path: 'itemimage/:nhno/:nino/:iino', component: ItemImageComponent, canActivate: [authGuard] }, 

  //Categories
  { path: 'categories/:nhno', component: CategoriesComponent, canActivate: [authGuard]   },   //Categories LM
  { path: 'category/:nhno', component: CategoryComponent, canActivate: [authGuard]   },       //Creating Category
  { path: 'category/:nhno/:nano', component: CategoryComponent, canActivate: [authGuard]   }, //Editing Category
  { path: 'quickadd/:nhno/:nano', component: QuickAddComponent, canActivate: [authGuard]   },   
  { path: 'quickadd/:nhno/:nano/:styl', component: QuickAddComponent, canActivate: [authGuard]   },   

  //Warehouse
  { path: 'warehouse/:nhno', component: WarehouseComponent, canActivate: [authGuard]   }, 

  //Customers
  { path: 'customers/:nhno', component: CustomersComponent, canActivate: [authGuard]  },
  { path: 'newcustomer/:nhno', component: CustomerComponent, canActivate: [authGuard]  },
  { path: 'newcustomer/:nhno/:acno', component: CustomerComponent, canActivate: [authGuard]  },
  { path: 'editcustomer/:nhno/:acno', component: CustomerComponent, canActivate: [authGuard]  },

  //Customizations
  { path: 'customizations/:nhno', component: CustomizationsComponent, canActivate: [authGuard]  }, 
  { path: 'newcustomization/:nhno', component: CustomizationComponent, canActivate: [authGuard]  }, 
  { path: 'newcustomization/:nhno/:vfgn', component: CustomizationComponent, canActivate: [authGuard]  }, 
  { path: 'customization/:nhno/:npno', component: CustomizationComponent, canActivate: [authGuard]  }, 
  { path: 'customization/:nhno/:npno/:vfgn', component: CustomizationComponent, canActivate: [authGuard]  }, 
  { path: 'vasapplications/:nhno/:npno', component: VasApplicationsComponent, canActivate: [authGuard]  },
  { path: 'vasapplications/:nhno/:npno/:vsmt', component: VasApplicationsComponent, canActivate: [authGuard]  },
  { path: 'newvasapplication/:nhno/:npno', component: VasApplicationComponent, canActivate: [authGuard]  },
  { path: 'newvasapplication/:nhno/:npno/:vedp', component: VasApplicationComponent, canActivate: [authGuard]  },
  { path: 'vasapplication/:nhno/:npno/:n1no', component: VasApplicationComponent, canActivate: [authGuard]  },
  { path: 'vasapplication/:nhno/:npno/:n1no/:vedp', component: VasApplicationComponent, canActivate: [authGuard]  },
  { path: 'vasquestion/:nhno/:npno', component: VasQuestionComponent, canActivate: [authGuard]  },
  { path: 'vasquestion/:nhno/:npno/:vhno', component: VasQuestionComponent, canActivate: [authGuard]  },

  //Mass Updates
  { path: 'massappadd/:nhno', component: MassappAddComponent, canActivate: [authGuard]  },
  { path: 'massappadd/:nhno/:vedp', component: MassappAddComponent, canActivate: [authGuard]  },
  { path: 'massappadd/:nhno/:vedp/:vsmt', component: MassappAddComponent, canActivate: [authGuard]  },
  { path: 'massappupdate/:nhno', component: MassappUpdateComponent, canActivate: [authGuard]  },
  { path: 'massappupdate/:nhno/:vedp', component: MassappUpdateComponent, canActivate: [authGuard]  },
  { path: 'massappupdate/:nhno/:vedp/:vsmt', component: MassappUpdateComponent, canActivate: [authGuard]  },
  { path: 'massappdelete/:nhno', component: MassappDeleteComponent, canActivate: [authGuard]  },
  { path: 'massquestion/:nhno', component: MassQuestionComponent },
  { path: 'massitem/:nhno', component: MassItemComponent },
  { path: 'massapp/:nhno', component: MassAppComponent },

  //Images
  { path: 'images/:nhno', component: ImagesComponent, canActivate: [authGuard]  },
  { path: 'images/:nhno/:npno', component: ImagesComponent, canActivate: [authGuard]  },
  { path: 'image/:nhno', component: ImageComponent, canActivate: [authGuard]  },
  { path: 'image/:nhno/:npno', component: ImageComponent, canActivate: [authGuard]  },

  //Notes
  { path: 'notes/:nhno', component: NotesComponent, canActivate: [authGuard]  },
  { path: 'note/:nhno', component: NoteComponent, canActivate: [authGuard]  },
  { path: 'note/:nhno/:nono', component: NoteComponent, canActivate: [authGuard]  },

  //Data Import
  { path: 'import/:nhno', component: ImportComponent, canActivate: [authGuard]  },
  { path: 'OEUL22/:nhno/:ulid', component: OEUL22Component, canActivate: [authGuard]  },
  { path: 'OEUL36/:nhno/:ulid', component: OEUL36Component, canActivate: [authGuard]  },

  //Data Export + Reports
  { path: 'export/:nhno', component: ExportComponent, canActivate: [authGuard]  },
  { path: 'OERP52/:nhno', component: OERP52Component, canActivate: [authGuard]  },
  { path: 'OERP53/:nhno', component: OERP53Component, canActivate: [authGuard]  },
  { path: 'OERP302/:nhno', component: OERP302Component, canActivate: [authGuard]  },

  //CXML Configuration
  { path: 'cxmlconfigs/:nhno', component: CxmlConfigsComponent, canActivate: [authGuard] },
  { path: 'cxmlcustomers/:nhno', component: CxmlCustomersComponent, canActivate: [authGuard]},
  { path: 'cxmlcustomer/:nhno', component: CxmlCustomerComponent, canActivate: [authGuard]},
  { path: 'cxmlcustomer/:nhno/:guno', component: CxmlCustomerComponent, canActivate: [authGuard]},
  { path: 'cxmlcategories/:nhno', component: CxmlCategoriesComponent, canActivate: [authGuard]},

  //Up Price List
  { path: 'uplist/:nhno', component: UplistComponent, canActivate: [authGuard]  },
  { path: 'uplist/:nhno/:plno', component: UplistComponent, canActivate: [authGuard]  },

  //Vas Price
  { path: 'vasprice/:nhno', component: VaspriceComponent, canActivate: [authGuard]  },

  //Audit
  { path: 'audit/:nhno', component: AuditComponent, canActivate: [authGuard]  },
  
  { path: 'iframe/:menu', component: IframeComponent, canActivate: [authGuard]  },
  { path: '**', component: UniformComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniformsRoutingModule { }
