import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { UniformsRoutingModule } from './uniforms-routing.module';
import { UniformComponent } from './uniform/uniform.component';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    UniformComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UniformsRoutingModule,
    AngularEditorModule
  ]
})
export class UniformsModule { }
