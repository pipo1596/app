import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { DataService } from '../../services/data-trigger.service';
import { FileUploadService } from '../../services/file-upload.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent {
  page = new Page();
  drop = false; // More Actions
  copy: any;
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

  // Parms
  nhno: any;
  styl: any;
  styli: any;
  item: any;
  nano: any;
  upct = "0";
  upctNic = "0";

  // Input
  desc = "";
  sku: any = [];
  warehouse: any; 
  cats: any = []; 
  custs: any = [];
  opv: string[][] = [[],[],[],[],[]];
  options: any = [];
  categories: any = [];
  customizations: any = [];

  // Product Flags/Information
  dsallow = "";
  autotag = "";
  contract = "";
  citem = "";
  cdesc = "";

  // Image Upload
  showUpload: boolean = false;
  image = new TextField("image", []);

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private uploadService: FileUploadService
  ) { hideWait(); }

  ngOnInit(): void {
    this.setMode();
    this.copy = localStorage.getItem('copy')
    this.getProduct();
    localStorage.clear();
  }

  getProduct(){
    showWait();
    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      styl: this.item ? this.item: this.styl,
      nano: this.nano,
      nino: this.page.editmode ? '000000000461849' : '', //Remove after
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.menu) this.page.menu = this.page.data?.menu;

      if(this.item){
        this.styl = this.item;
      } else if (this.page.data?.info?.styl) this.styl = this.page.data?.info.styl
              
      if (this.page.data?.info?.warehouse) this.warehouse = this.page.data?.info.warehouse
      if (this.page.data?.info?.customizations) this.custs = this.page.data?.info.customizations
      if(this.page.data?.info?.upct) this.upct = this.page.data?.info.upct;

      if(this.page.data?.info?.desc){
        if (this.copy){
          this.desc = 'Copy of ' + this.page.data?.info.desc;
        } else { this.desc = this.page.data?.info.desc; }
      }

      if (this.page.data?.info?.options){
        for (let i = 0; i < this.page.data?.info?.options.length; i++) {
          if (this.page.data?.info.options[i] !== ''){
            this.opv[i].push(this.page.data?.info.options[i])
          } else break }
      }

      if (this.page.data?.info?.nano){
        let cat = {
          nano: this.page.data?.info?.nano,
          desc: this.page.data?.info?.nadesc
        }
        this.cats = []
        this.cats.push(cat)
      }

      if (this.page.data?.info?.dsallowed) this.dsallow = this.page.data?.info?.dsallowed
      if (this.page.data?.info?.autotag) this.autotag = this.page.data?.info?.autotag
      if (this.page.data?.info?.contract) this.contract = this.page.data?.info?.contract
      if (this.page.data?.info?.nicitem) this.citem = this.page.data?.info?.nicitem
      if (this.page.data?.info?.nicdesc) this.cdesc = this.page.data?.info?.nicdesc
      if (this.page.data?.info?.nicupct) this.upctNic = this.page.data?.info?.nicupct
      if (this.page.data?.info?.img) this.image.value = this.page.data?.info?.img;
      this.page.loading = false;
      hideWait();
    });
  }

  inqStyle() {
    localStorage.clear();
    if(this.page.editmode){
      localStorage.setItem('p1', this.styli)
      localStorage.setItem('partpg','/uniforms/product/' + this.nhno + '/' + this.styli + '/')
    } else {
      localStorage.setItem('partpg','/uniforms/newproduct/' + this.nhno + '/')
    }
    localStorage.setItem('menu','/cgi/APOELMIS?PAMODE=*INQ&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N')
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMIS'])
  }

  searchConfig(){
    var config ={
      displayKey: 'desc',
      search: true,
      placeholder: 'Select',
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: 'desc'
    }
    return config
  }

  allSelected(opt: number, arr: any){
    if(JSON.stringify(this.opv[opt]) === JSON.stringify(arr)) { return true } else return false
  }

  selectAll(opt: number, arr: any){
    if(JSON.stringify(this.opv[opt]) === JSON.stringify(arr)) {
      this.opv[opt] = [];
    } else {
      this.opv[opt] = [];
      for (let i = 0; i < arr.length; i++) {
        this.opv[opt].push(arr[i])
      }
    }
    console.log(this.opv[opt])
  }

  checkOpt(opt: number, arr: any, i: any) {
      if(this.opv[opt].includes(arr[i])) {
        this.opv[opt].splice(this.opv[opt].indexOf(arr[i]),1)
      } else {
        this.opv[opt].push(arr[i]);
        this.opv[opt].sort();
      }    
  }

  generateOpt(){
    const arr1 = this.opv[0]
    const arr2 = this.opv[1]
    const arr3 = this.opv[2]
    let combinations = this.getCombinations([arr1,arr2,arr3]);
    for (let i = 0; i < combinations.length; i++) {
      this.options.push(combinations[i].toString().replaceAll(',',' '))
    }
    console.log(this.options)
  }

  getCombinations(arrays: any){
    if (!arrays || arrays.length === 0) {
      return [[]];
    }

    const firstArray = arrays[0];
    const remainingArrays = arrays.slice(1);

    const combinationsOfRemaining: any = this.getCombinations(remainingArrays);
    const result = [];

    for (const item of firstArray) {
      for (const combo of combinationsOfRemaining) {
        result.push([item, ...combo]);
      }
    }
    return result;
  }

  setMode() {
    if (this.router.url.indexOf('/uniforms/newproduct') >= 0) {
      this.page.entrymode = true;
    } else this.page.editmode = true;
      
    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.styl = params.get('styl')
      this.styli = params.get('styl')
      this.item = params.get('item')
    });
    this.showUpload = true;
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/products/' + this.nhno]);
  }

  loadProduct(){
    showWait();
    let mode = (this.page.editmode ? 'update' : 'create')

    this.options = [];
    if(this.opv){
      this.generateOpt();
    } else if(this.sku.length > 0){
      for (let i = 0; i < this.sku.length; i++) {
        this.options.push(this.sku[i].value)
      }
    }

    if(this.custs){
      this.customizations = [];
      for (let i = 0; i < this.custs.length; i++) {
        this.customizations.push(this.custs[i].npno)
      }
    }

    if(this.cats){
      this.categories = [];
      for (let i = 0; i < this.cats.length; i++) {
        this.categories.push(this.cats[i].nano)
      }
    }

    let data = {
      mode: mode,
      nhno: this.nhno,
      nano: '000000000036228',
      styl: 'AM001',
      sku: this.sku,
      options: this.options,
      whno: this.warehouse.whno, 
      categories: this.categories,
      customizations: this.customizations,
      dsallowed: this.dsallow,
      autotag: this.autotag,
      contract: this.contract, 
      item: this.citem, 
      desc: this.cdesc, 
      img: this.image.value, 
      upct: this.upct,
      upctNic: this.upctNic
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data?.upct) this.upct = this.page.data.upct;

      if (this.page.entrymode && this.page.data.result == 'pass' && this.page.data.nhno){
       localStorage.setItem('UP_AUTH','Y');
       this.router.navigate(['/uniforms/products/' + this.page.data.nhno]);
      }

      this.page.loading = false;
      hideWait();
    });
  }

  deleteProduct(){
    let data = {
      mode: 'delete',
      nhno: this.nhno,
      styl: this.styl, 
    }
    
    // this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
    //   this.page.data = response;
    //   if (this.page.data?.result == 'pass' && this.page.data?.nhno){
    //     localStorage.setItem('UP_AUTH','Y');
    //     this.router.navigate(['/uniforms/products/' + this.page.data?.nhno]);
    //   }
    //   this.page.loading = false;
    //   hideWait();
    // });
  }

  changeImage() {
    this.showUpload = true;
  }

  validate() {
    this.page.topErrorID = "";
    this.page.valid = true;

    // if (!this.tags.validate()) this.setTopErrorID(this.tags.htmlid);
    // focusField(this.page.topErrorID);

    if (this.page.valid){
      showWait();
      this.uploadImage();
    }
  }

  uploadImage() {
    this.dataService.triggerChild('');
  }

  saveAfterImageUpload(file: any) {
    this.image.value = file;

    if (!this.page.valid) {
      hideWait();
      return;
    }

    this.loadProduct();
  }
}
