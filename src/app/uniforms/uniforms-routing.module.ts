import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { UniformComponent } from './uniform/uniform.component';

const routes: Routes = [
  { path: 'newuniform', component: UniformComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniformsRoutingModule { }
