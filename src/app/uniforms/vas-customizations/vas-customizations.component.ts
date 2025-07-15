import { Component} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait, scrollToTopInstant} from '../../shared/utils';

@Component({
  selector: 'app-vas-customizations',
  standalone: false,
  templateUrl: './vas-customizations.component.html',
  styleUrl: './vas-customizations.component.css'
})

export class VasCustomizationsComponent {
  page = new Page();
  drop = false; // More Actions
  expanded: any[] = [];
  
  //Search / Dropdown
  style: any;
  customization: any;
  category: any;
  warehouse: any;
  stylconfig: any;

  //Checkboxes
  checked: any[] = [];

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    hideWait();
    this.page.loading = false;
    this.checked = [];
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.style = params.get('styl');
    });
    this.getCustomizations()
  }

  loadCustomization(mode: any, npno: any){
    localStorage.setItem('UP_AUTH','Y');
    switch(mode){
      case 'new':
        this.router.navigate(['/uniforms/newvascustomization/' + this.page.rfno]);
        break;
      case 'edit':
        this.router.navigate(['/uniforms/editvascustomization/' + this.page.rfno + '/' + npno]);
        break;
      case 'copy':
        this.router.navigate(['/uniforms/copyvascustomization/' + this.page.rfno + '/' + npno]);
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
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNI', data).subscribe(response => {

      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
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
    localStorage.setItem('UP_AUTH','Y');
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
}
