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
  drop = false; // More Actions
  assign: any;
  
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
  itemsPerPage: number = 10;
  total: number = 0;
  offset = "";

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.assign = localStorage.getItem('assign') ? JSON.parse(localStorage.getItem('assign')!) : '';
    localStorage.clear();
    this.checked = [];
    this.offset = '0';
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.style = params.get('styl');
    });
    this.getProducts()
  }

  loadProduct(mode: any, nino: any){
    localStorage.setItem('UP_AUTH','Y');
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
        this.getProducts();
      }
    });
  }

  getProducts() {
     let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      style: this.style,
      customization: this?.customization?.npno,
      category: this?.category?.nano,
      warehouse: this?.warehouse?.whno,
      stylconfig: this?.stylconfig?.vfgn,
      assign: this.assign ? 'Y' : '',
      aVfg: this.assign ? this.getConfig() : '',
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p,
      offset: this.offset
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNI', data).subscribe(response => {

      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.total) this.total = this.page.data.total
      if (this.page.data.offset) this.offset = this.page.data.offset
      if (this.page.data?.warehouses){
        this.page.data.warehouses.forEach((warehouse: any) => {
          warehouse.desc = warehouse.whno + ' - ' + warehouse.desc
        });
      }
      if (this.page.data?.categories) this.page.data.categories = this.page.data.categories.sort((a: any,b: any) => a.desc.localeCompare(b.desc))
      if (this.page.data?.customizations) this.page.data.customizations = this.page.data.customizations.sort((a: any,b: any) => a.desc.localeCompare(b.desc))
      this.page.loading = false;
      hideWait();
      scrollToTopInstant();
    });
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
    console.log(this.checked)
  }

  searchConfig(mode: string){
    var config ={
      displayKey: "desc",
      search: true,
      placeholder: mode,
      height: '300px',
      noResultsFound: 'No results found',
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

  getConfig(){
    let configs: any = []
    for (let i = 0; i < this.assign.length; i++) {
      for (let x = 0; x < this.assign[i].config.length; x++){
        if(configs.indexOf(this.assign[i].config[x]) == -1 && this.assign[i].config[x] !== ''){
          configs.push(this.assign[i].config[x])
        }
      }
    }
    console.log(configs)
    return configs
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }

  onItemChange(event: number){
    showWait();
    this.itemsPerPage = event
    this.getProducts()
  }

  onPageChange(event: number) {
    showWait();
    this.p = event
    this.getProducts()
  }
}
