import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttachmentUploadService } from '../../services/attachment-upload.service';
import { DataService } from '../../services/data-trigger.service';
import { hideWait, showWait } from '../utils';

@Component({
  selector: 'app-file-upload',
  standalone:false,
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css'],
})
export class FileUploadComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
  @Output() triggerEvent = new EventEmitter<string>();
  @Input() mode : string = "";
  @Input() iofile : string = "";
  @Input() iofkey : string = "";
  @Input() desc : string = "";
  @Input() types : string = "";
  @Input() iono : string = "";

  imageInfos?: Observable<any>;

  constructor(private uploadService: AttachmentUploadService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.imageInfos = this.uploadService.getFiles();
    this.dataService.getTriggerChildObservable().subscribe(data => {
      this.upload();
    });
  }
  
  triggerParentFunction(filename: any) {
    this.triggerEvent.emit(filename);
  }
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        showWait();
        this.preview = '';
        this.currentFile = file;
        const reader = new FileReader();

        reader.onload = (e: any) => {
          if(file.type.indexOf('image') >= 0) this.preview = e.target.result;
          hideWait();
        };

        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile, this.mode, this.iofkey, this.iofile, this.desc).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            } else if (event instanceof HttpResponse) {
              if(event.body.iono){
                localStorage.setItem('iono', event.body.iono)
              }
              this.message = event.body.message;
              this.imageInfos = this.uploadService.getFiles();
              this.triggerParentFunction(file.name);
            }
            
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          },
        });
      }

      this.selectedFiles = undefined;
    }
    else{
      this.triggerParentFunction('');
    }
  }
}
