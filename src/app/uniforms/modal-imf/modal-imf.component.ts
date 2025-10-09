import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { environment } from '../../../environments/environment.development';
import { DataService } from '../../services/data-trigger.service';
import { TextField } from '../../shared/textField';

@Component({
  selector: 'app-modal-imf',
  standalone: false,
  templateUrl: './modal-imf.component.html',
  styleUrl: './modal-imf.component.css'
})
export class ModalImfComponent {
  @Input() mode: any = ""
  @Output() close = new EventEmitter<void>();
  @Output() file = new EventEmitter<any>();
  accept: any = '.gif,.jpeg,.jpg,.tif,.png,.bmp';
  iofile: any;
  iofkey: any;
  image = new TextField("image", []);
  status: any = ""
  showUpload = false;

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit(): void {}

  closePopup() {
	this.close.emit();
  }

  validate() {
    this.uploadImage();
  }

  uploadImage() {
    this.dataService.triggerChild('');
  }

  saveAfterImageUpload(file: any) {
    if(!this.image?.error){
      let imf = {
        file: file,
        mode: this.mode
      }
      this.file.emit(JSON.stringify(imf));
      this.close.emit();
    }
  }

  clearFields(event: any){
    if(event){
      this.showUpload = false;
      this.status = ""
      this.image = new TextField("image", []);
    }
  }

  selectImage(event: any) {
    if(event) {
      this.showUpload = true
      this.status = this.chkIFS(event[0].name)
    }
  }

  chkIFS(image: any){
    let stat = ""
    let imageUrl = environment.apiurl + '/photos/styles/' + image
    let http = new XMLHttpRequest();
    http.open('GET', imageUrl, false);
    http.send();
    if(http.status == 200){
      stat = 'Existing Image will be overriden!'
    } else stat = 'New Image'
    return stat
  }
}
