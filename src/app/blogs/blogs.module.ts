import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BlogsRoutingModule } from './blogs-routing.module';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { BlogComponent } from './blog/blog.component';
import { BlogsComponent } from './blogs/blogs.component'
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AuthorsComponent } from './authors/authors.component';
import { AuthorComponent } from './author/author.component';




@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryComponent,
    BlogComponent,
    BlogsComponent,
    AuthorsComponent,
    AuthorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    BlogsRoutingModule,
    AngularEditorModule
  ]
})
export class BlogsModule { }
