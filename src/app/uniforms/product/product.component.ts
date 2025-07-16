import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { hideWait, showWait } from '../../shared/utils';

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

  // Parms
  nhno: any;
  nino: any;
  styl: any;
  upct = "0";
  upctNic = "0";

  // Input
  desc = "";
  sku: any = "";
  warehouse = ""; 
  cats: any; 
  custs = [];
  opv: string[][] = [[],[],[],[],[]];

  // Product Flags/Information
  dsallow = "";
  autotag = "";
  contract = "";
  citem = "";
  cdesc = "";

  // Image Upload
  showUpload: boolean = false;
  image = new TextField("image", ["required"]);

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { hideWait(); }

  ngOnInit(): void {
    this.setMode();
    hideWait();

    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      nino: this.nino,
      styl: this.styl
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
      this.page.data = response;

      //General Information
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.info?.styl) this.styl = this.page.data.info.styl
      if (this.page.data?.info?.warehouse) this.warehouse = this.page.data.info.warehouse
      if (this.page.data?.info?.customizations) this.custs = this.page.data.info.customizations
      if(this.page.data?.info?.upct) this.upct = this.page.data.info.upct;

      if (this.copy){
        this.desc = 'Copy of ' + this.page.data.info.desc;
      } else { this.desc = this.page.data.info.desc; }
      

      if (this.page.data?.info?.options){
        for (let i = 0; i < this.page.data?.info?.options.length; i++) {
          if (this.page.data.info.options[i] !== ''){
            this.opv[i] = this.page.data.info.options[i]
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

      //Product Flags + Product Information
      if (this.page.data?.info?.dsallowed) this.dsallow = this.page.data?.info?.dsallowed
      if (this.page.data?.info?.autotag) this.autotag = this.page.data?.info?.autotag
      if (this.page.data?.info?.contract) this.contract = this.page.data?.info?.contract
      if (this.page.data?.info?.nicitem) this.citem = this.page.data?.info?.nicitem
      if (this.page.data?.info?.nicdesc) this.cdesc = this.page.data?.info?.nicdesc
      if (this.page.data?.info?.nicupct) this.upctNic = this.page.data?.info?.nicupct

    });
    localStorage.clear();
    this.page.loading = false;
    hideWait();
  }

  inqStyle() {
    localStorage.clear();
    if(this.page.editmode){
      localStorage.setItem('p1', this.styl)
      localStorage.setItem('partpg','/uniforms/product/' + this.nhno + '/' + this.nino + '/')
    } else {
      localStorage.setItem('partpg','/uniforms/product/' + this.nhno + '/')
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
    if(this.page.editmode){
      this.opv[opt] = []
      this.opv[opt].push(arr[i])
    } else {
      if(this.opv[opt].includes(arr[i])) {
        this.opv[opt].splice(this.opv[opt].indexOf(arr[i]),1)
      } else {
        this.opv[opt].push(arr[i]);
        this.opv[opt].sort();
      }    
    }
      console.log(this.opv[opt])
  }

  setMode() {
    this.copy = localStorage.getItem('copy')

    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.nino = params.get('nino')
      this.styl = params.get('styl')
    });

    if (this.nino && !this.copy) {
      this.page.editmode = true;
      this.page.entrymode = false;
    } else { 
      this.page.entrymode = true;
      this.page.editmode = false;
    }

    // if (this.page.entrymode) this.showUpload = true;
    this.showUpload = true;
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/products/' + this.nhno]);
  }

  loadProduct(mode: string){
    // showWait();

    let data = {

      //General Information
      mode: mode, 
      nhno: this.nhno, //Uniform Program 
      nino: this.nino, //Product 
      styl: (mode !== 'delete') ? this.styl : '', //Item 
      options: (mode !== 'delete') ? this.opv : '', //Options
      whno: (mode !== 'delete') ? this.warehouse : '',  //Warehouse
      categories: (mode !== 'delete') ? this.cats : '', //Categories
      customizations: (mode !== 'delete') ? this.custs : '', //Customizations

      //Product Flags
      dsallowed: (mode !== 'delete') ? this.dsallow : '', //DS Allowed
      autotag: (mode !== 'delete') ? this.autotag : '', //Auto Tag
      contract: (mode !== 'delete') ? this.contract : '', //Contract Y/N
      item: (mode !== 'delete' ? this.citem : ''), //Contract Item #
      desc: (mode !== 'delete' ? this.cdesc : ''), //Contract Description

      upct: (mode == 'update') ? this.upct : '',
      upctNic: (mode == 'update') ? this.upctNic : ''
    }

    // this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
    //   this.page.data = response;
    //   if(this.page.data?.upct) this.upct = this.page.data.upct;

    //   if (mode !== 'update') {
    //     if (this.page.data.result == 'pass' && this.page.data.nhno){
    //       localStorage.setItem('UP_AUTH','Y');
    //       this.router.navigate(['/uniforms/products/' + this.page.data.nhno]);
    //     }
    //   }
    //   this.page.loading = false;
    //   hideWait();
    // });
  }

  //Image Upload Functions
  changeImage() {
    this.showUpload = true;
  }

  validate() {
    this.page.topErrorID = "";
    this.page.valid = true;

    if (this.page.valid) {
      if (this.showUpload)
        this.uploadImage();
      else
        this.saveAfterImageUpload(this.image.value);
    } 
  }

  uploadImage() {
    this.dataService.triggerChild('');
  }

  setTopErrorID(errorID: string) {
    if (this.page.topErrorID !== "") return;
    this.page.topErrorID = errorID;
    this.page.valid = false;
  }

  saveAfterImageUpload(file: any) {
    this.image.value = file;
    if (!this.image.validate()) this.setTopErrorID(this.image.htmlid);

    if (!this.page.valid){
      hideWait();
      return;
    }

    //Save Payload:
    let data = {
    }
  }
}
