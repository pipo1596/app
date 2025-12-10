import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { environment } from '../../../environments/environment.development';
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
  nino: any;
  styl: any;
  item: any;
  nano: any;
  cache: any;
  filters: any;
  upct: any;
  hasIW: any;
  showHelp: boolean = false;
  imgprfx = environment.logoprfx;

  // Input
  desc = "";
  sku: any = [];
  warehouse: any; 
  cats: any = []; 
  custs: any = [];
  opv: string[][] = [[],[],[],[],[]];
  options: any = [];
  op1U: any;
  op2U: any;
  op3U: any;
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
    this.copy = localStorage.getItem('copy')
    this.setMode();
    this.getProduct();
    localStorage.clear();
  }

  getProduct(){
    showWait();
    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      nino: this.nino,
      styl: this.item ? this.item : ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;

      if(this.item){
        this.styl = this.item;
      } else if (this.page.data?.info?.styl) this.styl = this.page.data?.info.styl
              
      if (this.page.data?.info?.warehouse) this.warehouse = this.page.data?.info.warehouse
      if (this.page.data?.info?.customizations) this.custs = this.page.data?.info.customizations
      if(this.page.data?.info?.upct) this.upct = this.page.data?.info.upct;

      if(this.page.data?.info?.desc) this.desc = this.page.data?.info.desc;
      if(!this.desc && this.page.data?.stylDesc) this.desc = this.page.data.stylDesc

      if (this.page.data?.optionChk){
        for (let i = 0; i < this.page.data?.optionChk.length; i++) {
          //Option 1
          if(this.page.data?.optionChk[i].opv1 !== '' && !this.opv[0].includes(this.page.data?.optionChk[i].opv1)) {
            this.opv[0].push(this.page.data?.optionChk[i].opv1)
          }
          //Option 2
          if(this.page.data?.optionChk[i].opv2 !== '' && !this.opv[1].includes(this.page.data?.optionChk[i].opv2)) {
            this.opv[1].push(this.page.data?.optionChk[i].opv2)
          }
          //Option 3
          if(this.page.data?.optionChk[i].opv3 !== '' && !this.opv[2].includes(this.page.data?.optionChk[i].opv3)) {
            this.opv[2].push(this.page.data?.optionChk[i].opv3)
          }
        }
      }

      if (this.page.data?.sku) this.page.data.sku = this.page.data.sku.sort((a:any,b: any) => a.desc.localeCompare(b.desc))
      if (this.page.data?.customizations) this.page.data.customizations = this.page.data.customizations.sort((a: any,b: any) => a.npno.localeCompare(b.npno))
      if(this.page.data?.categories){
        this.page.data.categories = this.page.data.categories.sort((a: any,b: any) => a.nano.localeCompare(b.nano))
      }
      if (this.page.data?.warehouses){
        this.page.data.warehouses.forEach((warehouse: any) => {
          warehouse.desc = warehouse.whno + ' - ' + warehouse.desc
        });
      }

      if (this.page.data?.info?.nano){
        this.nano = this.page.data?.info?.nano
        let cat = {
          nano: this.page.data?.info?.nano,
          desc: this.page.data?.info?.pdesc
        }
        // this.cats = []
        this.cats.push(cat)
      }

      if (this.page.data?.info?.dsallowed) this.dsallow = this.page.data?.info?.dsallowed
      if (this.page.data?.info?.autotag) this.autotag = this.page.data?.info?.autotag
      if (this.page.data?.info?.contract) this.contract = this.page.data?.info?.contract
      if (this.page.data?.info?.nicitem) this.citem = this.page.data?.info?.nicitem
      if (this.page.data?.info?.nicdesc) this.cdesc = this.page.data?.info?.nicdesc
      if (this.page.data?.info?.img) this.image.value = this.page.data?.info?.img;
      if (this.page.data?.info?.upct) this.upct = this.page.data?.info?.upct;
      if (this.page.data?.info?.hasIW) this.hasIW = this.page.data?.info?.hasIW;

      if(this.cache) this.getCache();

      this.page.loading = false;
      hideWait();
    });
  }

  getCache() {
    this.cache = JSON.parse(this.cache)
    this.sku = this.cache.sku;
    this.opv = this.cache?.options;
    this.categories = this.cache.categories;
    this.customizations = this.cache.customizations;
    this.dsallow = this.cache.DSALLOWED;
    this.autotag = this.cache.AUTOTAG;
    this.contract = this.cache.CONTRACT;
  }

  inqStyle() {
    localStorage.clear();
    if(this.page.editmode){
      localStorage.setItem('p1', this.item)
      localStorage.setItem('partpg','/uniforms/product/' + this.nhno + '/' + this.nino + '/')
    } else {
      localStorage.setItem('partpg','/uniforms/newproduct/' + this.nhno + '/')
    }
    localStorage.setItem('menu','/cgi/APOELMIS?PAMODE=*INQ&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N')
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMIS'])
  }

  bldCache() {

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

    let cache = {
      nhno: this.nhno,
      nino: this.nino,
      nano: this.nano,
      styl: this.styl,
      whno: this.warehouse?.whno, 
      categories: this.categories,
      options: this.opv,
      customizations: this.customizations,
      DSALLOWED: this.dsallow,
      AUTOTAG: this.autotag,
      CONTRACT: this.contract, 
      item: this.citem, 
      desc: this.cdesc,
      sku: this.sku
    }

    localStorage.setItem('cache', JSON.stringify(cache));
  }

  catConfig(){
    var config ={
      displayFn:(item: any) => { 
        let cat = ""
        if(item.desc3) cat = item.desc3 + ' > '
        if(item.desc2) cat = cat + item.desc2 + ' > '
        if(item.desc) cat = cat + item.desc
        return cat
      },
      displayKey: 'desc',
      search: true,
      placeholder: 'Select',
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: 'desc',
      customComparator: (i1: any,i2: any) => {
        let ret = i1[config.displayKey] < i2[config.displayKey];
        return ret? -1: 1;
      }
    }
    return config
  }

  searchConfig(){
    var config ={
      displayKey: 'desc',
      search: true,
      placeholder: 'Select',
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: 'desc',
      customComparator: (i1: any,i2: any) => {
        let ret = i1[config.displayKey] < i2[config.displayKey];
        return ret? -1: 1;
      }
    }
    return config
  }
  
  fulfillConfig(){
    var config ={
      displayFn:(item: any) => { 
        return item.whno + ' - ' + item.desc
      },
      displayKey: 'desc',
      search: true,
      placeholder: 'Select',
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: 'desc',
      customComparator: (i1: any,i2: any) => {
        let ret = i1[config.displayKey] < i2[config.displayKey];
        return ret? -1: 1;
      }
    }
    return config
  }

  allSelected(opt: number, arr: any){
    if(JSON.stringify(this.opv[opt].sort()) === JSON.stringify(arr.sort())) { return true } else return false
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
    let arrays = []
    const arr1 = this.opv[0]
    const arr2 = this.opv[1]
    const arr3 = this.opv[2]

    if(arr1.length > 0){
      arrays.push(arr1)
    } else arrays.push(['*']);

    if(arr2.length > 0){
      arrays.push(arr2)
    } else arrays.push(['*']);

    if(arr3.length > 0){
      arrays.push(arr3)
    } else arrays.push(['*']);

    if(arr1.length == 0 && arr2.length == 0 && arr3.length == 0) arrays = []

    let optIX = 0
    for(let i = 0; i < arrays.length; i++){
      for(let y = 0; y < arrays[i].length; y++){
        if(arrays[i][y] !== '*'){
          optIX += 1
          break
        }
      }
    }

    if(optIX > 1){
      let combinations = this.getCombinations(arrays);
      for (let i = 0; i < combinations.length; i++) {
        let combo = combinations[i].toString().replaceAll('*','')
        combo = combo.replaceAll(',',' ')
      this.options.push(combo)
      }
    } else {
      this.options = arrays[0];
    }
  }

  getCombinations(arrays: any){
    if (!arrays || arrays.length === 0) {
      return [[]];
    }

    // for(let i = 0; i < arrays.length; i++){
    //   for(let y = 0; y < arrays[i].length; y++){
    //     if(arrays[i][y] == '*'){
    //       arrays[i].splice(arrays[i].indexOf(arrays[i][y]),1)
    //     }
    //   }
    // }

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
    if (this.router.url.indexOf('/uniforms/newproduct') >= 0 || this.copy) {
      this.page.entrymode = true;
    } else this.page.editmode = true;
      
    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.nino = params.get('nino')
      this.item = params.get('styl')
    });

    if(!this.item && localStorage.getItem('styl')){
      this.item = localStorage.getItem('styl')
    }

    if(localStorage.getItem('nano') && this.page.entrymode){
      let naCat = JSON.parse(localStorage.getItem('nano')!)
      this.cats.push(naCat);
    }

    if(localStorage.getItem('cache')){
      this.cache = localStorage.getItem('cache');
    }

    if(localStorage.getItem('filters')){
      this.filters = localStorage.getItem('filters');
    }

    this.showUpload = true;
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    if(this.filters) localStorage.setItem('filters',this.filters)
    this.router.navigate(['/uniforms/products/' + this.nhno]);
  }

  goImg() {
    localStorage.setItem('UP_AUTH','Y');
    if(this.hasIW){
      this.router.navigate(['/uniforms/overrides/' + this.nhno + '/' + this.nino]);
    } else {
      this.router.navigate(['/uniforms/override/' + this.nhno + '/' + this.nino]);
    }

  }

  getUnselected(){
    this.op1U = []
    this.op2U = []
    this.op3U = []
    for(let i = 0; i < this.page.data?.option1?.length; i++){
      if(this.page.data?.option1){
        if(!this.opv[0]?.includes(this.page.data?.option1[i])){
          this.op1U.push(this.page.data?.option1[i])
        }
      }
    }

    for(let i = 0; i < this.page.data?.option2?.length; i++){
      if(this.page.data?.option2){
        if(!this.opv[1]?.includes(this.page.data?.option2[i])){
          this.op2U.push(this.page.data?.option2[i])
        }
      }
    }

    for(let i = 0; i < this.page.data?.option3?.length; i++){
      if(this.page.data?.option3){
        if(!this.opv[2]?.includes(this.page.data?.option3[i])){
        this.op3U.push(this.page.data?.option3[i])
        }
      }
    }

    this.op1U = this.op1U.join(',');
    this.op2U = this.op2U.join(',');
    this.op3U = this.op3U.join(',');
  }

  loadProduct(){
    showWait();
    let mode = (this.page.editmode ? 'update' : 'create')

    this.options = [];
    if(this.sku.length == 0 && this.opv){
      this.generateOpt();
    } else if(this.sku.length > 0){
      for (let i = 0; i < this.sku.length; i++) {
        this.options.push(this.sku[i].value)
      }
    }
    this.getUnselected()

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
      nino: mode == 'update' ? this.nino : '',
      nano: this.nano,
      styl: this.styl,
      whno: this.warehouse?.whno, 
      categories: this.categories,
      options: this.options,
      customizations: this.customizations,
      DSALLOWED: this.dsallow,
      AUTOTAG: this.autotag,
      CONTRACT: this.contract, 
      item: this.citem, 
      desc: this.cdesc,
      op1U: this.op1U,
      op2U: this.op2U,
      op3U: this.op3U,
      upct: mode == 'update' ? this.upct : ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
      this.page.data = response;

      if(this.filters) localStorage.setItem('filters',this.filters)
      if (this.page.data.result == 'pass'){
       localStorage.setItem('UP_AUTH','Y');
       this.router.navigate(['/uniforms/products/' + this.nhno]);
      }

      this.page.loading = false;
      hideWait();
    });
  }

  deleteProduct(){
    showWait();
    this.options = [];
    if(this.sku.length == 0 && this.opv){
      this.generateOpt();
    } else if(this.sku.length > 0){
      for (let i = 0; i < this.sku.length; i++) {
        this.options.push(this.sku[i].value)
      }
    }

    let data = {
      mode: 'delete',
      nhno: this.nhno,
      nano: this.nano,
      styl: this.styl,
      options: this.options 
    }
    
    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.result == 'pass'){
        localStorage.setItem('UP_AUTH','Y');
        this.router.navigate(['/uniforms/products/' + this.page.data?.nhno]);
      }
      this.page.loading = false;
      hideWait();
    });
  }

  newCategory() {
    this.bldCache();
    let partpg = this.page.editmode ? '/uniforms/product/' + this.nhno + '/' + this.nino :  '/uniforms/newproduct/' + this.nhno
    localStorage.setItem('partpg', partpg)
    localStorage.setItem('styl', this.styl)
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/category/' + this.nhno]);
  }

  newCustomization(mode: any) {
    this.bldCache();
    let partpg = '/uniforms/product/' + this.nhno + '/' + this.nino
    localStorage.setItem('partpg', partpg)
    localStorage.setItem('vfgn', this.page.data?.info?.vfgn)
    if(mode == 'drop') localStorage.setItem('ctno', this.page.data?.isctno ? this.page.data.isctno : this.page.data?.info.isctno)
    localStorage.setItem('nino', this.page.data?.info?.nino)
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/newcustomization/' + this.nhno]);
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
