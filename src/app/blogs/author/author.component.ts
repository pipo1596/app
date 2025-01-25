import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { focusField, hideWait, openModal, showWait, transformToSeoUrl, transformToTags } from '../../shared/utils';
import { FileUploadService } from '../../services/file-upload.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-author',
  standalone: false,
  templateUrl: './author.component.html',
  styleUrl: './author.component.css'
})
export class AuthorComponent {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '15rem',
    minHeight: '700px',
    placeholder: 'Enter Text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'backgroundColor',
        'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        'justifyLeft',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'unlink'
      ]
    ],
    uploadUrl: environment.imgprfx,
    upload: (file: File) => {
      showWait('Uploading Image...');
      return new Observable((observer) => {
        // Upload image via your Angular service
        const uniqueFileName = file.name.replace(/(\.[\w\d_-]+)$/i, `-${Date.now()}$1`);
        const uniqueFile = new File([file], uniqueFileName, { type: file.type });
        this.uploadService.uploadWyzywig(uniqueFile).subscribe(
          (response) => {
            // Check the response for the image URL
            const imageUrl = response?.imageUrl;
            if (imageUrl) {
              // Prepend the base URL to the relative image path
              const fullImageUrl: any = { "body": { "imageUrl": environment.imgprfx + '/' + imageUrl } };
              // Pass the full image URL to the editor (this triggers the insertion)
              hideWait();
              observer.next(fullImageUrl);

            }
          },
          (error) => {
            observer.error('Upload failed: ' + error.message);
            observer.complete();
            hideWait();
          }
        );
      })
    }



    ,
    uploadWithCredentials: true,
    sanitize: false,

  };
  //This contains all the share page data:
  page = new Page();
  showUpload: boolean = false;
  //Screen Fields
  authorName = new TextField("authorname", ["required"]);
  authorBio = new TextField("authorbio", ["required"]);
  authorstatus = new TextField("authorstatus", ["required"]);
  metatitle = new TextField("metatitle", ["required"]);
  metadescription = new TextField("metadescription", ["required"]);
  urlandhandle = new TextField("urlandhandle", ["required"]);
  tags = new TextField("tags", []);
  image = new TextField("image", ["required"]);

  parents: any = [];
  fullmode: boolean = false;
  formData = new FormData();
  chunks: any = [];
  chunkSize: number = 10000;

  html: any;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private uploadService: FileUploadService
  ) { }
  ngOnInit(): void {
    this.page.imgprfx = environment.imgprfx;
    this.authorBio.value = "";
    this.setMode();

    let data = {

      mode: this.page.editmode ? 'GETAUTOR' : 'INIT',
      bano: this.page.rfno
    }
    this.http.post(environment.apiurl + '/cgi/APPSRAUTOR', data).subscribe(response => {

      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      this.page.loading = false;

      hideWait();
      if (this.page.editmode) {
        this.authorName.value = this.page.data.author.name;
        this.authorBio.value = this.page.data.author.bio;
        this.authorstatus.value = this.page.data.author.stat;
        this.metatitle.value = this.page.data.author.mett;
        this.metadescription.value = this.page.data.author.metd;
        this.urlandhandle.value = this.page.data.author.url;
        this.tags.value = this.page.data.author.metk;
        this.image.value = this.page.data.author.img;
      }
    })
  }

  cancelEntry() {
    if(this.page.changes)
      openModal('cancelEntry');
    else
      this.goBack();
  }
  startDelete() {
    openModal('deleteAuthor');
  }

  setSeo(){
      this.urlandhandle.value = transformToSeoUrl(this.authorName.value);
      this.metatitle.value = transformToTags(this.authorName.value);
    }
    cleanMeta(){
      this.metatitle.value = transformToTags(this.metatitle.value);
    }
    cleanUrl(){
      this.urlandhandle.value = transformToSeoUrl(this.urlandhandle.value);
    }

  onDelete() {

    let data = {
      mode: 'DELETE',
      bano: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPLMAUTOR', data).subscribe(response => {
      this.goBack();
    });
  }

  validate() {

    this.page.topErrorID = "";
    this.page.valid = true;
    if (!this.authorName.validate()) this.setTopErrorID(this.authorName.htmlid);
    if (!this.authorBio.validate()) this.setTopErrorID(this.authorBio.htmlid);
    if (!this.authorstatus.validate()) this.setTopErrorID(this.authorstatus.htmlid);
    if (!this.metatitle.validate()) this.setTopErrorID(this.metatitle.htmlid);
    if (!this.metadescription.validate()) this.setTopErrorID(this.metadescription.htmlid);
    if (!this.urlandhandle.validate()) this.setTopErrorID(this.urlandhandle.htmlid);
    if (!this.tags.validate()) this.setTopErrorID(this.tags.htmlid);

    focusField(this.page.topErrorID);

    if (this.page.valid) {
      showWait();
      if (this.showUpload)
        this.uploadImage();
      else
        this.saveAfterImageUpload(this.image.value);
    } else {
      this.fullmode = false;
    }

  }

  changeImage() {
    this.showUpload = true;
  }

  setTopErrorID(errorID: string) {
    if (this.page.topErrorID !== "") return;
    this.page.topErrorID = errorID;
    this.page.valid = false;

  }

  saveAfterImageUpload(file: any) {
    this.image.value = file;
    if (!this.image.validate()) this.setTopErrorID(this.image.htmlid);
    focusField(this.page.topErrorID);

    if (!this.page.valid) {
      hideWait();
      return;
    }

    let data = {
      mode: this.page.entrymode ? 'NEWAUTOR' : 'EDITAUTOR',
      bastat: this.authorstatus.value,
      baname: this.authorName.value,
      bamett: this.metatitle.value,
      bametd: this.metadescription.value,
      bametk: this.tags.value,
      baurl: this.urlandhandle.value,
      baimg: file,
      bio: this.authorBio.value.slice(0, 10000),//Limited to 10k (DB)
      babano: this.page.rfno,
      parents: this.parents
    }

    this.http.post(environment.apiurl + '/cgi/APPSRAUTOR', data).subscribe(response => {

      this.goBack();

    });
  }

  uploadImage() {
    this.dataService.triggerChild('');
  }


  goBack() {
    this.router.navigate(['/blogs/authorslist']);
  }
  setMode() {

    // It's the edit category route, retrieve the ID
    if (this.router.url.indexOf('/blogs/newauthor') >= 0) {
      this.page.entrymode = true;
    }
    if (this.router.url.indexOf('/blogs/editauthor') >= 0) {
      this.page.editmode = true;
    }
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('id');
    });

    if (this.page.entrymode) this.showUpload = true;
  }

}
