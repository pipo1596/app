import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-massapp-update',
  standalone: false,
  templateUrl: './massapp-update.component.html',
  styleUrl: './massapp-update.component.css'
})
export class MassappUpdateComponent {
  //Display
  page = new Page();
  type: any = "";
  v1cd: any = "";
  v2no: any = "";
  errors: any;
  row: any;
  itemChng: any = false;

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
  newDesc: any = "";
  groups: any = [];
  grpChecked: any = [];

  //Vas Items
  acno: any = "";
  newVedp: any = "";
  newVSku: any = "";
  newVDesc: any = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.newVedp = params.get('vedp');
    });
    if (this.newVedp) this.getVEDP()
    if (localStorage.getItem('p1')) this.getCache();
    localStorage.clear();
    this.getInfo();
  }

  getCache(){
    if (localStorage.getItem('p1')){
      let p1 = JSON.parse(localStorage.getItem('p1')!);
      this.type = p1.type;
      this.vedp = p1.vedp;
      this.acno = p1.acno;
      this.v1cd = p1.v1cd;
      this.name = p1.name;
      this.desc = p1.desc;
      this.levl = p1.levl;
      this.styl = p1.styl;
      this.vfgn = p1.vfgn;
      this.ctno = p1.ctno;
    }
  }

  getInfo(){
    this.row = ''
    showWait()
    let data = {
      mode: 'getInfoU',
      nhno: this.page.rfno,
      type: this.type,
      v1cd: this.v1cd,
      v2no: this.type == 'Q' ? this.v2no : '',
      name: this.name,
      vedp: this.type == 'V' ? this.vedp : this.vedp?.vedp,
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

      if (this.page.data?.acno) this.acno = this.page.data.acno
      if (this.page.data?.v1cd && this.type == 'V') this.v1cd = this.page.data.v1cd

      this.page.loading = false;
      hideWait();
    });
  }

  updateApps(){
    if(confirm("Are you sure you want to update all of these?")){
      showWait()
      let data = {
        mode: 'update',
        type: this.type,
        nhno: this.page.rfno,
        v1cd: this.v1cd,
        newDesc: this.newDesc,
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
        this.newDesc = "";
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
      let customization = this.page.data?.cstmzChk[x].npDesc;
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

  inqItem() {
    localStorage.clear();
    let p1 = {
      type: this.type,
      vedp: this.vedp,
      acno: this.acno,
      v1cd: this.v1cd,
      name: this.name,
      desc: this.desc,
      levl: this.levl,
      styl: this.styl,
      vfgn: this.vfgn,
      ctno: this.ctno
    }
    localStorage.setItem('p1', JSON.stringify(p1));
    localStorage.setItem('partpg','/uniforms/massappupdate/' + this.page.rfno + '/')
    let menu = '/cgi/APOELMIS2?PAMODE=*INQ&PMV1CD=' + this.v1cd + '&PMACNO=' + this.acno + '&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N' 
    localStorage.setItem('menu', menu)
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMIS2'])
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

  showTable(){
    let show = true;
    if ((this.type == 'A' || this.type == 'Q') && !this.v1cd) show = false
    if (this.type == 'Q' && !this.v2no) show = false 
    if (this.type == 'V' && (!this.vedp || this.itemChng)) show = false 
    return show
  }

  clrType() {
    this.errors = ""
    this.grpChecked = []
    this.groups = []
    this.vedp = ""
    this.newVedp = ""
    this.newVDesc = ""
    this.newVSku = ""
    this.v1cd = "";
  }

  clrFields() {
    this.errors = ""
    this.grpChecked = []
    this.groups = []
    this.newVedp = ""
    this.newVDesc = ""
    this.newVSku = ""
  }

  getVEDP(){
    let data = {
      nhno: this.page.rfno,
      mode: 'getVEDP',
      vedp: this.newVedp
    }

    let temp = new Page()

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAD', data).subscribe(response => {
      temp.data = response;
      if (temp.data?.vedp_desc) this.newVDesc = temp.data.vedp_desc
      if (temp.data?.vedp_sku) this.newVSku = temp.data.vedp_sku
    });
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }
}
