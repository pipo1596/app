import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { dbtodspdate, dbtodsptime, escapeHtml, focusField, getSite, hideWait, openModal, showWait, transformToSeoUrl, transformToTags } from '../../shared/utils';
import { FileUploadService } from '../../services/file-upload.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog',
  standalone: false,

  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
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
       
        this.uploadService.uploadWyzywig(file).subscribe(
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
  updatebpno: any;
  showUpload: boolean = false;
  //Screen Fields
  blogTitle = new TextField("blogtitle", ["required"]);
  blogHtml = new TextField("bloghtml", ["required"]);
  blogstatus = new TextField("blogstatus", ["required"]);
  publishdate = new TextField("publishdate", ["required"]);
  publishtime = new TextField("publishtime", ["required"]);
  author = new TextField("author", ["required"]);
  metatitle = new TextField("metatitle", ["required"]);
  metadescription = new TextField("metadescription", ["required"]);
  site = new TextField("site", []);
  urlandhandle = new TextField("urlandhandle", ["required"]);
  tags = new TextField("tags", []);
  primarycategory = new TextField("tags", []);
  image = new TextField("image", ["required"]);

  parents: any = [];
  fullmode: boolean = false;
  formData = new FormData();
  chunks: any = [];
  chunkSize: number = 10000;

  html: any;

  categories: any = [[]];//Multidimensional Array to support structure

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private uploadService: FileUploadService
  ) { }
  ngOnInit(): void {
    this.page.imgprfx = environment.imgprfx;
    this.blogHtml.value = "";
    this.setMode();

    let data = {

      mode: this.page.editmode ? 'GETBLOG' : 'INIT',
      bpno: this.page.rfno
    }
    this.http.post(environment.apiurl + '/cgi/APPSRBLOG', data).subscribe(response => {

      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      this.page.loading = false;

      hideWait();
      if (this.page.editmode) {
        this.blogTitle.value = this.page.data.blog.titl;
        this.blogHtml.value = this.page.data.blog.html;
        this.blogstatus.value = this.page.data.blog.stat;
        this.publishdate.value = dbtodspdate(this.page.data.blog.pbdt);
        this.publishtime.value = dbtodsptime(this.page.data.blog.pbtm);
        this.site.value = this.page.data.blog.site;
        this.metatitle.value = this.page.data.blog.mett;
        this.author.value = this.page.data.blog.bano;
        this.metadescription.value = this.page.data.blog.metd;
        this.urlandhandle.value = this.page.data.blog.url;
        this.tags.value = this.page.data.blog.metk;
        this.image.value = this.page.data.blog.img;
      }


      if (this.page.entrymode) {
        this.site.value = getSite();
        let now = new Date();
        this.publishdate.value = now.toISOString().split('T')[0];
        this.publishtime.value = '00:00';
        this.getCategories('', 0, 0, false);
        this.primarycategory.value = "0";
      } else {

        this.defaultCategories()
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
    openModal('deleteBlog');
  }

  setSeo(){
    this.urlandhandle.value = transformToSeoUrl(this.blogTitle.value);
    this.metatitle.value = transformToTags(this.blogTitle.value);
  }
  cleanMeta(){
    this.metatitle.value = transformToTags(this.metatitle.value);
  }
  cleanUrl(){
    this.urlandhandle.value = transformToSeoUrl(this.urlandhandle.value);
  }
  buildUrl():string{
    let url = ""
    this.categories.forEach((outercateg: any,indexo:number)=>{//Based on the selected primary category
      if(indexo==parseInt(this.primarycategory.value)){
        outercateg.forEach((categ:any)=>{
            categ.list.forEach((list: any)=>{
              if(list.bcno==categ.value){
                if(url=="")
                  url=transformToSeoUrl(list.url);
                else
                  url= url + '/' +  transformToSeoUrl(list.url);
              }
            })
      })
    }
    });
    
    if(url=="")
      url=transformToSeoUrl(this.urlandhandle.value);
    else
      url= url + '/' +  transformToSeoUrl(this.urlandhandle.value);
    return url;
  }
  onDelete() {

    let data = {
      mode: 'DELETE',
      bpno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPLMBLOG', data).subscribe(response => {
      this.goBack();
    });
  }

  validate() {
    this.getparents(), console.log(this.parents);
    this.page.topErrorID = "";
    this.page.valid = true;
    if (!this.blogTitle.validate()) this.setTopErrorID(this.blogTitle.htmlid);
    if (!this.blogHtml.validate()) this.setTopErrorID(this.blogHtml.htmlid);
    if (!this.blogstatus.validate()) this.setTopErrorID(this.blogstatus.htmlid);
    if (!this.publishdate.validate()) this.setTopErrorID(this.publishdate.htmlid);
    if (!this.publishtime.validate()) this.setTopErrorID(this.publishtime.htmlid);
    if (!this.site.validate()) this.setTopErrorID(this.site.htmlid);
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
    this.getparents();
    //Save Payload:
    this.htmlChunks();
    let data = {
      mode: this.page.entrymode ? 'NEWBLOG' : 'EDITBLOG',
      bpstat: this.blogstatus.value,
      bpsite: this.site.value,
      bptitl: this.blogTitle.value,
      bpmett: this.metatitle.value,
      bpmetd: this.metadescription.value,
      bpbano: this.author.value,
      bpmetk: this.tags.value,
      bpurl: this.urlandhandle.value,
      bppbdt: this.publishdate.value.replaceAll('-', ''),
      bppbtm: this.publishtime.value.replaceAll(':', ''),
      bpimg: file,
      html: this.chunks,
      bpbpno: this.page.rfno,
      parents: this.parents
    }

    this.http.post(environment.apiurl + '/cgi/APPSRBLOG', data).subscribe(response => {

      //this.updatebpno = response;


      this.goBack();

    });
  }


  htmlChunks() {
    let fullhtml = escapeHtml(this.blogHtml.value);
    const length = fullhtml.length;
    this.chunks = [];

    for (let i = 0; i < length; i += this.chunkSize) {
      this.chunks.push(
        { "chunk": fullhtml.slice(i, i + this.chunkSize) }
      );
    }
  }
  getparents() {

    this.parents = [];
    this.categories.forEach((categ: any, io: number) => {
      let bcnp = ""
      categ.forEach((categi: any) => {

        if (categi.value !== "") bcnp = categi.value

      });
      let categElmt = {
        "bcnp": bcnp,
        "primary": (parseInt(this.primarycategory.value) == io)
      }
      let ii = this.parents.findIndex((item:any)=>item.bcnp==bcnp);
      if (ii<0) {
        this.parents.push(categElmt);
      }else{
        if(categElmt.primary) this.parents[ii].primary = categElmt.primary;
      }
    });


  }
  uploadImage() {
    this.dataService.triggerChild('');
  }

  addCategory() {

    this.categories.push([]);
    this.getCategories('', this.categories.length - 1, 0);

  }
  removeCategory(indexo: number) {

    this.categories.splice(indexo,1);
    if (parseInt(this.primarycategory.value) == indexo || this.categories.length==1)
      this.primarycategory.value = "0";

  }

  defaultCategories() {
    this.categories = [[]];
    this.primarycategory.value = "0";

    this.page.data.parents.forEach((parent: { bcno: string, prim: string; }, indexo: number) => {
      if (indexo == 0) this.categories.pop();
      this.categories.push([]);

      if (parent.prim == "Y") this.primarycategory.value = indexo.toString();

    });
    this.getCategories('', 0, 0, true);


  }

  getCategories(bcno: string,
    indexo: number,
    indexi: number,
    initialize?: boolean) {
    initialize = initialize ?? false;
    showWait();
    let data = {
      mode: 'CHILD',
      site: this.site.value,
      bcno: bcno
    }
    if (!initialize) {
      //Clear Subsequent when changing dropdown

      for (const [indexii, categ] of this.categories[indexo].entries()) {

        if (indexii < this.categories[indexo].length - 1) {//Clear all subsequent:
          for (let next = indexi; next < this.categories[indexo].length; next++) {
            this.categories[indexo][next] = [];
          }
        }
      }
    }

    this.http.post(environment.apiurl + '/cgi/APPSRBCATG', data).subscribe(response => {

      if (this.categories[indexo].length - 1 < indexi) {
        this.categories[indexo].push({ value: "", list: [] });
      }
      if (bcno !== '' || indexi == 0) {
        this.categories[indexo][indexi].list = response;
        if (initialize) {
          this.initDrop(indexo);
          if (this.categories[indexo][indexi].value !== '') {
            this.getCategories(this.categories[indexo][indexi].value, indexo, indexi + 1, true);
          } else {
            if (indexi == this.categories[indexo].length - 1
              &&
              indexo < this.categories.length - 1) {//Do the next level
              this.getCategories('', indexo + 1, 0, true);
            }
          }

        }
        else {
          this.categories[indexo][indexi].value = '';
        }
      }


      hideWait();

    });

  }
  initDrop(indexo: number) {

    if (this.page.data.parents.length < 1) return;
    this.categories[indexo].forEach((categArr: any) => {

      categArr.list.forEach((catg: any) => {
        this.page.data.parallel[indexo].forEach((path: any) => {
          if (catg.bcno == path.bcno)
            categArr.value = catg.bcno;
        });

        if (this.page.data.parents[indexo].bcno == catg.bcno)
          categArr.value = catg.bcno;
      });
    });

  }

  goBack() {
    this.router.navigate(['/blogs/blogslist']);
  }
  setMode() {

    // It's the edit category route, retrieve the ID
    if (this.router.url.indexOf('/blogs/newblog') >= 0) {
      this.page.entrymode = true;
    }
    if (this.router.url.indexOf('/blogs/editblog') >= 0) {
      this.page.editmode = true;
    }
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('id');
    });

    if (this.page.entrymode) this.showUpload = true;
  }

}
