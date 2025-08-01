import { Component} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-customizations',
  standalone: false,
  templateUrl: './customizations.component.html',
  styleUrl: './customizations.component.css'
})

export class CustomizationsComponent {
  page = new Page();
  drop = false; // More Actions

  //Filter
  desc: any;
  vitem: any;
  app: any;
  img: any = "";
  styl: any;
  vfg: any;
  ctno: any;
  lsdt: any;
  lsdtUsa: any;

  //Checkboxes
  checked: any[] = [];
  assigned: any[] = [];

  //Paging
  p: number = 1;
  itemsPerPage: number = 10;
  total: number = 0;
  offset = "0";

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    hideWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getCustomizations()
  }

  loadAction(action: any){
    localStorage.setItem('UP_AUTH','Y')
    this.router.navigate(['/uniforms/mass' + action + '/' + this.page.rfno]);
  }

  getCustomizations() {
    showWait();
     let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      desc: this.desc,
      item: this.vitem?.vedp,
      app: this.app?.v1cd,
      img: this.img,
      style: this.styl?.styl,
      vfg: this.vfg?.vfgn,
      ctno: this.ctno?.ctno,
      lsdt: this.lsdtUsa,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNP', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.total) this.total = this.page.data.total
      if (this.page.data?.stylDrop){
        this.page.data.stylDrop.forEach((styl: any) => {
          styl.desc = styl.styl + ' - ' + styl.desc
        });
      }
      this.page.loading = false;
      hideWait();
    });
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

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNP', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.result != 'pass'){
        this.page.loading = false;
        hideWait();
      } else {
        this.getCustomizations();
      }
    });
  }

  allChecked(){
    for (let i = 0; i < this.page.data?.customizations.length; i++) {
      if(!(this.isChecked(this.page.data.customizations[i]))){
        return false;
      }
    } return true;
  }

  isChecked(customization: any){
    return this.checked.some(function(el){ return el.npno === customization.npno})
  }

  checkAll() {
    var all = this.allChecked()
    for (let i = 0; i < this.page.data.customizations.length; i++) {
      if (!all && !this.isChecked(this.page.data.customizations[i]) ||
           all && this.isChecked(this.page.data.customizations[i])) {
        this.checkCustomization(this.page.data.customizations[i])
      }
    }
  }

  checkCustomization(customization: any) {
    let configurators = []
    for (let i = 0; i < customization.styles.length; i++){
      configurators.push(customization.styles[i].vfgn)
    }

    let np = {
      npno: customization.npno,
      config: configurators
    }

    if(this.isChecked(np)) {
      let index = this.checked.findIndex(x => x.npno === np.npno)
      this.checked.splice(index,1)
    } else {
      this.checked.push(np);
      this.checked.sort();
    }    
  }

  assignStyles(){
    showWait()
    if(this.checked.length == 0){
      window.alert("Must select a customization to assign styles");
    } else{
      localStorage.setItem('UP_AUTH','Y')
      let customizations = JSON.stringify(this.checked)
      localStorage.setItem('assign',customizations)
      this.router.navigate(['/uniforms/products/' + this.page.rfno]);
    }
    hideWait()
    this.page.loading = false;
  }

  searchConfig(mode: string){
    var config ={
      displayKey: "desc",
      search: true,
      placeholder: mode,
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: mode == 'Style' ? 'styl' : 'desc'
    }
    return config
  }

  loadVAS(npno: any){
    localStorage.setItem('UP_AUTH','Y')
    this.router.navigate(['/uniforms/vasapplications/' + this.page.rfno + '/' + npno]);
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
