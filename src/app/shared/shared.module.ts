import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmComponent } from './confirm/confirm.component';
import { ToastComponent } from './toast/toast.component';  // Import HttpClientModule explicitly
import { FormsModule } from '@angular/forms';
import { ImageUploadComponent } from './imageupload/imageupload.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FileUploadComponent } from './fileupload/fileupload.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ConfirmComponent,
    ToastComponent,
    ImageUploadComponent,
    FileUploadComponent,
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    ConfirmComponent,
    ToastComponent,
    ImageUploadComponent,
    FileUploadComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ]
})
export class SharedModule { }
