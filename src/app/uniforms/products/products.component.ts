import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait, scrollToTopInstant} from '../../shared/utils';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent {
  page = new Page();
  assign: any;
  inNano: any;
  
  //Search / Dropdown
  style: any;
  customization: any;
  category: any;
  warehouse: any;
  stylconfig: any;

  //Checkboxes
  checked: any[] = [];

  //Paging
  p: number = 1;
  itemsPerPage: number = 50;
  total: number = 0;
  offset = "";

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.assign = localStorage.getItem('assign') ? JSON.parse(localStorage.getItem('assign')!) : '';
    this.inNano = localStorage.getItem('nano') ? JSON.parse(localStorage.getItem('nano')!) : '';
    // if(this.inNano) this.category = this.inNano;
    if(localStorage.getItem('filters')){
      this.getCache();
    }
    localStorage.clear();
    this.checked = [];
    this.offset = '0';
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.style = params.get('styl');
    });
    this.getProducts('')
  }

  loadProduct(mode: any, nino: any){
    localStorage.setItem('UP_AUTH','Y');
    this.bldCache();
    switch(mode){
      case 'new':
        this.router.navigate(['/uniforms/newproduct/' + this.page.rfno]);
        break;
      case 'edit':
        this.router.navigate(['/uniforms/product/' + this.page.rfno + '/' + nino]);
        break;
      case 'copy':
        localStorage.setItem('copy',nino)
        this.router.navigate(['/uniforms/product/' + this.page.rfno + '/' + nino]);
        break;
    }
  }

  deleteProduct(product: any){
    showWait();

    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      nano: product.nano,
      styl: product.styl
    }
    
    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.result !== 'pass'){
        this.page.loading = false;
        hideWait();
      } else {
        this.getProducts('');
      }
    });
  }

  getProducts(mode: any) {
    showWait();
    if(mode == 'search') this.p = 1;
     let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      style: this.style,
      customization: this?.customization?.npno,
      category: this?.inNano?.nano ? this.inNano.nano : this?.category?.nano,
      warehouse: this?.warehouse?.whno,
      stylconfig: this?.stylconfig?.vfgn,
      assign: this.assign ? 'Y' : '',
      aVfg: this.assign ? this.getConfig('config') : '',
      aNpno: this.assign ? this.getConfig('npno') : '',
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p,
      offset: this.offset
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNI', data).subscribe(response => {

      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.total) this.total = this.page.data.total;
      if (this.page.data.offset) this.offset = this.page.data.offset;
      if (this.page.data?.warehouses){
        this.page.data.warehouses.forEach((warehouse: any) => {
          warehouse.desc = warehouse.whno + ' - ' + warehouse.desc
        });
      }
      if (this.page.data?.categories){
        this.page.data.categories = this.page.data.categories.sort((a: any,b: any) => a.desc.localeCompare(b.desc))
        if(this.inNano){
          for (let x = 0; x < this.page.data?.categories.length; x++) {
            if(this.page.data.categories[x].nano == this.inNano.nano){
              this.inNano.desc = this.page.data.categories[x].desc
              this.category = this.inNano;
              this.inNano = ''
            }
          }
        }
      }

      if (this.page.data?.customizations) this.page.data.customizations = this.page.data.customizations.sort((a: any,b: any) => a.desc.localeCompare(b.desc))
      this.page.loading = false;
      hideWait();
      scrollToTopInstant();
    });
  }
  
  trim(value: any){
    return value.replace(/^0+/, '')
  }
  
  allChecked(){
    for (let x = 0; x < this.page.data?.products.length; x++) {
      if(!(this.isChecked(this.page.data.products[x]))){
        return false;
      }
    } return true;
  }

  isChecked(product: any){
    return this.checked.some(function(x){ return x.nino === product.nino})
  }

  checkAll() {
    var all = this.allChecked()
    for (let i = 0; i < this.page.data.products.length; i++) {
      if (!all && !this.isChecked(this.page.data.products[i]) ||
           all && this.isChecked(this.page.data.products[i])) {
        this.checkProduct(this.page.data.products[i])
      }
    }
  }

  checkProduct(product: any) {
    if(this.isChecked(product)) {
      let index = this.checked.findIndex(x => x.nino === product.nino)
      this.checked.splice(index,1)
    } else {
      this.checked.push(product);
      this.checked.sort();
    }    
  }

  searchConfig(mode: string){
    var config ={
      displayKey: "desc",
      search: true,
      placeholder: mode,
      height: '300px',
      noResultsFound: 'No results found',
      customComparator: (i1: any,i2: any) => {
        let ret = i1[config.displayKey] < i2[config.displayKey];
        return ret? -1: 1;
      }
    }
    return config
  }

  inqStyle() {
    localStorage.clear();
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('partpg','/uniforms/products/' + this.page.rfno + '/')
    localStorage.setItem('menu','/cgi/APOELMIS?PAMODE=*INQ&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N')
    this.router.navigate(['/uniforms/iframe/APOELMIS'])
  }

  assignStyles(){
    localStorage.setItem('UP_AUTH','Y');
    let npnos = [];
    let ninos = [];

    for (let i = 0; i < this.assign.length; i++) {
      npnos.push(this.assign[i].npno);
    }

    for (let i = 0; i < this.checked.length; i++) {
      ninos.push(this.checked[i].nino); //Passing base NI record and applying to all?
    }

    let data = {
      nhno: this.page.rfno,
      npno: npnos,
      nino: ninos
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPASSIGN', data).subscribe(response => {
      localStorage.setItem('UP_AUTH','Y');
      this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
    })
  }

  getConfig(rtMode: any){
    let configs: any = []
    let aNpnos: any = []
    for (let i = 0; i < this.assign.length; i++) {
        if(aNpnos.indexOf(this.assign[i].npno) == -1 && this.assign[i].npno !== ''){
          configs.push(this.assign[i].config)
          aNpnos.push(this.assign[i].npno)
        }
      }

    if(rtMode == 'config') {
      return configs 
    } else return aNpnos
  }

  saveSeq(nino: any, seq: any, upct: any){
    showWait();
    let data = {
      mode: 'seq',
      nhno: this.page.rfno,
      nino: nino,
      seq: seq
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNI', data).subscribe(response => {
      this.getProducts('');
    });
  }

  bldCache() {
    let cache = {
      customization: this.customization,
      category: this.category,
      warehouse: this.warehouse,
      stylconfig: this.stylconfig
    }

    localStorage.setItem('filters', JSON.stringify(cache));
  }

  getCache() {
    let cache = JSON.parse(localStorage.getItem('filters')!)
    this.customization = cache?.customization;
    this.category = cache?.category;
    this.warehouse = cache?.warehouse;
    this.stylconfig = cache?.stylconfig;
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }

  goBackNA() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/categories/' + this.page.rfno]);
  }

  onItemChange(event: number){
    showWait();
    this.itemsPerPage = event
    this.getProducts('')
  }

  onPageChange(event: number) {
    showWait();
    this.p = event
    this.getProducts('')
  }
}
