import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmComponent } from './confirm/confirm.component';
import { ToastComponent } from './toast/toast.component';  // Import HttpClientModule explicitly



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ConfirmComponent,
    ToastComponent
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    ConfirmComponent,
    ToastComponent,
    CommonModule,
    HttpClientModule
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
