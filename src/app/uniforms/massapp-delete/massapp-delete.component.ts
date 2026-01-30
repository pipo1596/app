import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-massapp-delete',
  standalone: false,
  templateUrl: './massapp-delete.component.html',
  styleUrl: './massapp-delete.component.css'
})
export class MassappDeleteComponent {
  //Display
  page = new Page();
  v1cd: any = "";
  errors: any;
  row: any;

  //Filters
  name: any = ""; //Customization Name
  vedp: any = ""; //VAS Item
  desc: any = ""; //Application Description
  levl: any = ""; //Question Level Items
  styl: any = ""; //Style
  vfgn: any = ""; //Style Configurator Template
  ctno: any = ""; //VAS Category
  
  //Input
  applications: any = [];
  groups: any = [];
  grpChecked: any = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getInfo();
  }

  getInfo(){
    this.row = ''
    showWait()
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      v1cd: this.v1cd,
      name: this.name,
      vedp: this.vedp?.vedp,
      desc: this.desc,
      levl: this.levl?.valu,
      styl: this.styl?.styl,
      vfgn: this.vfgn?.vfgn,
      ctno: this.ctno?.ctno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAD', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.appDrp) this.applications = this.page.data.appDrp;
      if (this.page.data?.cstmzChk){ 
        this.page.data.cstmzChk = this.page.data.cstmzChk.sort((a: any,b: any) => a.npno.localeCompare(b.npno))
        this.groups = this.page.data.cstmzChk;

        if(this.grpChecked.length == 0){
        for (let x = 0; x < this.page.data?.cstmzChk.length; x++) {
          this.grpChecked.push(this.page.data.cstmzChk[x].n1no)
        }
        }
      }

    
      if (this.page.data?.stylDrop){
        this.page.data.stylDrop = this.page.data.stylDrop.sort((a: any,b: any) => a.styl.localeCompare(b.styl))
        this.page.data.stylDrop.forEach((styl: any) => {
          styl.desc = styl.styl + ' - ' + styl.desc
        });
      }

      if (this.page.data?.itemDrop){
        this.page.data.itemDrop.forEach((item: any) => {
          item.desc = item.desc !== '' ? item.sku + ' - ' + item.desc : item.sku
        });
      }

      if (this.page.data?.vfgnDrop){
        this.page.data.vfgnDrop.forEach((config: any) => {
          config.desc = config.desc + ' - ' + config.vfgn
        });
      }

      if (this.page.data?.lvlDrop){
        this.page.data.lvlDrop = this.page.data.lvlDrop.sort((a: any,b: any) => a.valu.localeCompare(b.valu))
      }

      this.page.loading = false;
      hideWait();
    });
  }

  deleteApps(){
    if(this.grpChecked.length == 0){
      this.errors = 'Must select at least one Application'
      return
    } else this.errors = ''

    if(confirm("Are you sure you want to delete all of these? Are you sure you've selected the correct customizations?")){
      showWait()
      let data = {
        mode: 'delete',
        nhno: this.page.rfno,
        v1cd: this.v1cd,
        n1noArr: this.grpChecked
      }

      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAD', data).subscribe(response => {
        this.page.data = response;
        if (this.page.data.title) this.page.title = this.page.data.title;
        if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
        if (this.page.data.menu) this.page.menu = this.page.data.menu;
        if (this.page.data.result == 'fail'){
          this.errors = this.page.data.errors
        } else this.errors = ''
        this.grpChecked = [];
        this.getInfo();
      });
    }
  }

  isRow(group: any, index: any){
    if(!this.row || this.row !== group || index == 0){
      this.row = group
      return true
    } else return false;

  }

  isChecked(group: any){
    if (this.grpChecked.indexOf(group) !== -1){
      return true;
    } else return false;
  }

  buildApps(group: any){
    let apps: any = []
    for (let x = 0; x < this.page.data?.cstmzChk.length; x++) {
      let customization = this.page.data?.cstmzChk[x].npno;
      if(customization == group){
        let data = {
          n1no: this.page.data?.cstmzChk[x].n1no,
          nv1Desc: this.page.data?.cstmzChk[x].nv1Desc
        }
        apps.push(data);
      }
    } 
    return apps;
  }

  checkGroup(group: any){
    if(this.isChecked(group)){
      this.grpChecked.splice(this.grpChecked.indexOf(group),1)
    } else {
      this.grpChecked.push(group)
    }
  }

  allChecked(){
    for (let x = 0; x < this.page.data?.cstmzChk.length; x++) {
      if(!(this.isChecked(this.page.data?.cstmzChk[x].n1no))){
        return false;
      }
    } return true;
  }

  checkAll(){
    var all = this.allChecked()
    for (let i = 0; i < this.page.data?.cstmzChk.length; i++) {
      if (!all && !this.isChecked(this.page.data?.cstmzChk[i].n1no) ||
           all && this.isChecked(this.page.data?.cstmzChk[i].n1no)) {
        this.checkGroup(this.page.data?.cstmzChk[i].n1no)
      }
    }
  }

  searchConfig(mode: string){
    var config ={
      displayKey: "desc",
      search: true,
      placeholder: mode,
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: mode == 'Style' ? 'styl' : 'desc',
      customComparator: (i1: any,i2: any) => {
        let ret = i1[config.displayKey] < i2[config.displayKey];
        return ret? -1: 1;
      }
    }
    return config
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }
}
