import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { UniformComponent } from './uniform/uniform.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerComponent } from './customer/customer.component';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './note/note.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { ProductsComponent } from './products/products.component';
import { UplistComponent } from './uplist/uplist.component';
import { VaspriceComponent } from './vasprice/vasprice.component';
import { ImagesComponent } from './images/images.component';
import { ImageComponent } from './image/image.component';
import { IframeComponent } from './iframe/iframe.component';

const routes: Routes = [
  //Uniform
  { path: 'newuniform', component: UniformComponent },
  { path: 'newuniform/:acno', component: UniformComponent },

  //Dashboard
  { path: 'dashboard/:nhno', component: DashboardComponent },

  //Products
  { path: 'products/:nhno', component: ProductsComponent }, 
  { path: 'products/:nhno/:styl', component: ProductsComponent }, 

  //Categories
  { path: 'categories/:nhno', component: CategoriesComponent },
  { path: 'editcategory/:nhno/:nano', component: CategoryComponent }, 
  { path: 'newcategory/:nhno', component: CategoryComponent }, 
  { path: 'copycategory/:nhno/:nano', component: CategoryComponent }, 

  //Customers
  { path: 'customers/:nhno', component: CustomersComponent },
  { path: 'newcustomer/:nhno', component: CustomerComponent },
  { path: 'newcustomer/:nhno/:acno', component: CustomerComponent },
  { path: 'editcustomer/:nhno/:acno', component: CustomerComponent },

  //Notes 
  { path: 'notes/:nhno', component: NotesComponent },
  { path: 'newnote/:nhno', component: NoteComponent },
  { path: 'editnote/:nhno/:nono', component: NoteComponent },

  //Images
  { path: 'images/:nhno', component: ImagesComponent },
  { path: 'newimage/:nhno', component: ImageComponent },

  //UP Price List
  { path: 'uplist/:nhno', component: UplistComponent },
  { path: 'uplist/:nhno/:plno', component: UplistComponent },

  //Vas Price
  { path: 'vasprice/:nhno', component: VaspriceComponent },

  { path: 'iframe/:menu', component: IframeComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniformsRoutingModule { }
