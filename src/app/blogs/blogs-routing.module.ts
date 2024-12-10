import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from '../home/home.component';
import { CategoryComponent } from './category/category.component';

const routes: Routes = [
  { path: 'categories', component: CategoriesComponent },
  { path: 'newcategory', component: CategoryComponent },
  { path: 'viewcategory/:id', component: CategoryComponent },
  { path: 'editcategory/:id', component: CategoryComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
