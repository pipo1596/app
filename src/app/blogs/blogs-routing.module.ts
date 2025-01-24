import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from '../home/home.component';
import { CategoryComponent } from './category/category.component';
import { BlogComponent } from './blog/blog.component';
import { BlogsComponent } from './blogs/blogs.component';
import { AuthorsComponent } from './authors/authors.component';
import { AuthorComponent } from './author/author.component';

const routes: Routes = [
  { path: 'categories', component: CategoriesComponent },
  { path: 'newcategory', component: CategoryComponent },
  { path: 'editcategory/:id', component: CategoryComponent },
  
  { path: 'blogslist', component: BlogsComponent },
  { path: 'newblog', component: BlogComponent },
  { path: 'editblog/:id', component: BlogComponent },

  { path: 'authorslist', component: AuthorsComponent },
  { path: 'newauthor', component: AuthorComponent },
  { path: 'editauthor/:id', component: AuthorComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
