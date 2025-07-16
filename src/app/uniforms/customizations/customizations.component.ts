import { Component} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait, scrollToTopInstant} from '../../shared/utils';

@Component({
  selector: 'app-customizations',
  standalone: false,
  templateUrl: './customizations.component.html',
  styleUrl: './customizations.component.css'
})

export class CustomizationsComponent {
  page = new Page();
  drop = false; // More Actions
  
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
    localStorage.clear();
    hideWait();
    this.checked = [];
    this.offset = '0';
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.style = params.get('styl');
    });
    this.getCustomizations()
  }

  loadAction(action: any){
    localStorage.setItem('UP_AUTH','Y')
    this.router.navigate(['/uniforms/mass' + action + '/' + this.page.rfno]);
  }

  loadCustomization(mode: any, npno: any){
    localStorage.setItem('UP_AUTH','Y')
    switch(mode){
      case 'new':
        this.router.navigate(['/uniforms/customization/' + this.page.rfno]);
        break;
      case 'edit':
        this.router.navigate(['/uniforms/customization/' + this.page.rfno + '/' + npno]);
        break;
      case 'copy':
        localStorage.setItem('copy',npno)
        this.router.navigate(['/uniforms/customization/' + this.page.rfno + '/' + npno]);
        break;
    }
  }

  deleteCustomization(npno: string){
    showWait();
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      npno: npno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
      this.page.data = response;

      if (this.page.data.result != 'pass'){
        this.page.loading = false;
        hideWait();
      } else {
        this.getCustomizations();
      }
    });
  }

  getCustomizations() {
     let data = {
      nhno: this.page.rfno,
      style: this.style,
      customization: this?.customization?.npno,
      category: this?.category?.nano,
      warehouse: this?.warehouse?.whno,
      stylconfig: this?.stylconfig?.vfgn,
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
      this.page.loading = false;
      hideWait();
      scrollToTopInstant();
    });
  }

  allChecked(){
    for (let i = 0; i < this.page.data?.products.length; i++) {
      if(!(this.isChecked(this.page.data.customizations[i]))){
        return false;
      }
    } return true;
  }

  isChecked(customization: any){
    return this.checked.some(function(el){ return el.npno === customization.npno})
  }

  checkAll() {
    for (let i = 0; i < this.page.data.customizations.length; i++) {
      this.checkCustomization(this.page.data.customizations[i])
    }
  }

  checkCustomization(customization: any) {
    if(this.isChecked(customization)) {
      let index = this.checked.findIndex(x => x.npno === customization.npno)
      this.checked.splice(index,1)
    } else {
      this.checked.push(customization);
      this.checked.sort();
    }    
  }

  assignStyles(){
    localStorage.setItem('UP_AUTH','Y')
    this.router.navigate(['/uniforms/customizations/assign/' + this.page.rfno]);
  }

  searchConfig(mode: string){
    var config ={
      displayKey: "desc",
      search: true,
      placeholder: mode,
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: 'desc'
    }
    return config
  }

  loadVAS(npno: any){
    localStorage.setItem('UP_AUTH','Y')
    this.router.navigate(['/uniforms/vascustomizations/' + this.page.rfno + '/' + npno]);
  }

  onItemChange(event: number){
    showWait();
    this.itemsPerPage = event
    this.getCustomizations()
  }

  onPageChange(event: number) {
    showWait();
    this.p = event
    this.getCustomizations()
  }
}
