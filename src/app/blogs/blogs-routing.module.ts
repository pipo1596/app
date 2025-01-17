import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from '../home/home.component';
import { CategoryComponent } from './category/category.component';
import { BlogComponent } from './blog/blog.component';
import { BlogsComponent } from './blogs/blogs.component';

const routes: Routes = [
  { path: 'categories', component: CategoriesComponent },
  { path: 'newcategory', component: CategoryComponent },
  { path: 'viewcategory/:id', component: CategoryComponent },
  { path: 'editcategory/:id', component: CategoryComponent },
  
  { path: 'blogslist', component: BlogsComponent },
  { path: 'newblog', component: BlogComponent },
  { path: 'newblog/:id', component: BlogComponent },
  { path: 'viewblog/:id', component: BlogComponent },
  { path: 'editblog/:id', component: BlogComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
