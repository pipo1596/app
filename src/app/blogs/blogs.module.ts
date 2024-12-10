import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BlogsRoutingModule } from './blogs-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';


@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BlogsRoutingModule
  ]
})
export class BlogsModule { }
