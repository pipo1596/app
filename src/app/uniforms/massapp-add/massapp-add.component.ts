import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-massapp-add',
  standalone: false,
  templateUrl: './massapp-add.component.html',
  styleUrl: './massapp-add.component.css'
})
export class MassappAddComponent {
  //Display
  page = new Page();
  v1cd: any = "";
  errors: any = [];
  row: any;

  //Filters
  name: any = ""; //Customization Name
  vedp: any = ""; //VAS Item
  desc: any = ""; //Application Description
  levl: any = ""; //Question Level Items
  styl: any = ""; //Style
  vfgn: any = ""; //Style Configurator Template
  acno: any = "";
  npno: any = "";
  
  //Input
  applications: any = [];
  groups: any = [];
  questions: any = [];
  grpChecked: any = [];
  procBlob: any = [];
  processed: any = false;
  confirmed: any = false;
  locn: any = ""
  vedpDesc: any;
  vedpSku: any;
  mand: any;
  actv: any;
  seq = "1";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('p1')) this.getCache();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      if(this.processed && params.get('vedp')) this.vedp = params.get('vedp');
    });
    if(this.vedp) this.getVEDP()
    localStorage.clear();
    if(!this.processed && !this.confirmed) this.getInfo();
    if(this.processed) this.getInfoA();
  }

  getCache(){
    if (localStorage.getItem('p1')){
      let p1 = JSON.parse(localStorage.getItem('p1')!);
      this.vedp = p1.vedp;
      this.acno = p1.acno;
      this.v1cd = p1.v1cd;
      this.desc = p1.desc;
      this.locn = p1.locn;
      this.mand = p1.mand;
      this.actv = p1.actv;
      this.seq = p1.seq;
      this.vfgn = p1.vfgn;
      if(p1.checked) this.grpChecked = JSON.parse(p1.checked);
      if(p1.groups) this.groups = JSON.parse(p1.groups);
      if(p1.questions) this.questions = JSON.parse(p1.questions);
      if(p1.processed == 'Y'){
        this.processed = true;
      } else this.processed = false;
    }
  }

  getInfo(){
    this.row = ''
    showWait()

    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      npno: this.npno,
      vfgn: this.vfgn,
      name: this.name,
      v1cd: this.v1cd.v1cd,
      vedp: this.vedp.vedp,
      styl: this.styl?.styl,
      levl: this.levl?.valu,
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAA', data).subscribe(response => {
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
          this.grpChecked.push(this.page.data.cstmzChk[x].npno)
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

      if (this.page.data?.appDrp){
        this.page.data.appDrp.forEach((app: any) => {
          app.desc = app.desc + ' - ' + app.v1cd
        });
      }

      if (this.page.data?.acno) this.acno = this.page.data.acno

      this.page.loading = false;
      hideWait();
    });
  }

  getInfoA(){
    this.errors = [];
    showWait();

    if(!this.vfgn){
      this.errors.push('Style Configurator Template is required')
      hideWait();
      return
    }

    if(!(this.grpChecked.length > 0)){
      this.errors.push('Must select at least one Customization Group')
      hideWait();
      return
    }

    let npArr = [];
    this.procBlob = [];
    for (let i = 0; i < this.groups.length; i++){
      if(this.grpChecked.includes(this.groups[i].npno)){
        npArr.push(this.groups[i].npno)
        this.procBlob.push((this.groups[i].npName + ' (' + this.trim(this.groups[i].npno) + ')'))
      }
    }

    let data = {
      mode: 'getInfoA',
      nhno: this.page.rfno,
      vfgn: this.vfgn,
      locn: this.locn,
      npArr: npArr
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAA', data).subscribe(response => {
      this.page.data = response;
      this.processed = true;
      this.confirmed = false;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if(this.page.data?.vdno){
        this.page.data.vdno = this.page.data.vdno.sort((a: any,b: any) => a.valu.localeCompare(b.valu))
      }
      if (this.page.data?.v1cd){
        this.page.data.v1cd.forEach((app: any) => {
          app.desc = app.desc + ' - ' + app.valu
        });
      }
      hideWait();
    });
  }

  getQuestions(){
    this.errors = [];
    showWait();
    if(!this.locn && !this.v1cd){
      if(!this.errors.includes('Must select a Location OR Application')){
        this.errors.push('Must select a Location OR Application')
      }
    }

    if(!this.desc){
      if(!this.errors.includes('Description is required')){
        this.errors.push('Description is required')
      }
    }

    if(this.errors.length > 0){
      hideWait();
      return
    }

    let npArr = []
    for (let i = 0; i < this.groups.length; i++){
      if(this.grpChecked.includes(this.groups[i].npno)){
        npArr.push(this.groups[i].npno)
      }
    }

    let v2no = [];
    let dflk = [];
    let dspd = [];
    let req = [];
    let dfan = [];
    if(this.confirmed){
      for (let i = 0; i < this.questions.length; i++) {
        v2no.push(this.questions[i].v2no);
        dflk.push((<HTMLInputElement>document.getElementById('dflk' + i + this.questions[i]!.v2no)).checked ? 'Y' : 'N');
        dspd.push((<HTMLInputElement>document.getElementById('dspd' + i + this.questions[i]!.v2no)).checked ? 'Y' : '');
        req.push((<HTMLInputElement>document.getElementById('req' + i + this.questions[i]!.v2no)).value);
        dfan.push((<HTMLInputElement>document.getElementById('dfan' + i + this.questions[i]!.v2no)).value);
      } 
    }

    let data = {
      mode: this.confirmed ? 'saveApp' : 'getQstn',
      nhno: this.page.rfno,
      vfgn: this.vfgn,
      locn: this.locn,
      v1cd: this.v1cd,
      desc: this.desc,
      vedp: this.vedp,
      mand: this.mand,
      actv: this.actv,
      seq: this.seq,
      v2no: v2no,
      dflk: dflk,
      dspd: dspd,
      req: req,
      dfan: dfan,
      npArr: npArr
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAA', data).subscribe(response => {
      this.page.data = response;
      this.processed = false;
      this.confirmed = true;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.questions){
        this.questions = this.page.data?.questions.sort((a: any,b: any) => a.v2no.localeCompare(b.v2no))
      }

      if (this.page.data?.result == 'fail'){
        this.confirmed = false;
        this.processed = true;
        this.errors = this.page.data?.errors.toString().split(",")
      } else if(this.confirmed){
        this.locn = ""
        this.v1cd = ""
        this.desc = ""
        this.mand = ""
        this.actv = ""
        this.seq = ""
        this.errors = []
        this.confirmed = ""
        this.processed = ""
      } 

      hideWait();
    });
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

  checkGroup(group: any){
    if(this.isChecked(group)){
      this.grpChecked.splice(this.grpChecked.indexOf(group),1)
    } else {
      this.grpChecked.push(group)
    }
  }

  allChecked(){
    for (let x = 0; x < this.page.data?.cstmzChk.length; x++) {
      if(!(this.isChecked(this.page.data?.cstmzChk[x].npno))){
        return false;
      }
    } return true;
  }

  checkAll(){
    var all = this.allChecked()
    for (let i = 0; i < this.page.data?.cstmzChk.length; i++) {
      if (!all && !this.isChecked(this.page.data?.cstmzChk[i].npno) ||
           all && this.isChecked(this.page.data?.cstmzChk[i].npno)) {
        this.checkGroup(this.page.data?.cstmzChk[i].npno)
      }
    }
  }

  clearItem() {
    this.vedp = ""
    this.vedpDesc = ""
    this.vedpSku = ""

    // if(!this.vedp){
    //   let temp = new Page();
    //   let data = {
    //     nhno: this.page.rfno,
    //     mode: 'getDflt',
    //     v1cd: this.v1cd
    //   }
    //   this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
    //     temp.data = response;
    //     if (temp.data?.vedp_desc) this.vedpDesc = temp.data?.vedp_desc
    //     if (temp.data?.vedp_sku) this.vedpSku = temp.data?.vedp_sku
    //     if (temp.data?.vedp) this.vedp = temp.data?.vedp
    //   });
    // }
  }

  inqItem() {
    localStorage.clear();
    let p1 = {
      locn: this.locn,
      v1cd: this.v1cd,
      desc: this.desc,
      vedp: this.vedp,
      mand: this.mand,
      actv: this.actv,
      seq: this.seq,
      acno: this.acno,
      vfgn: this.vfgn,
      processed: this.processed ? 'Y' : '',
      checked: JSON.stringify(this.grpChecked),
      groups: JSON.stringify(this.groups)
    }
    localStorage.setItem('p1', JSON.stringify(p1));
    localStorage.setItem('partpg','/uniforms/massappadd/' + this.page.rfno + '/')
    let menu = '/cgi/APOELMIS2?PAMODE=*INQ&PMV1CD=' + this.v1cd + '&PMACNO=' + this.acno  + '&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N' 
    localStorage.setItem('menu', menu)
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMIS2'])
  }

  getVEDP(){
    let data = {
      nhno: this.page.rfno,
      mode: 'getvedp',
      vedp: this.vedp
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.vedp_desc) this.vedpDesc = this.page.data.vedp_desc
      if (this.page.data?.vedp_sku) this.vedpSku = this.page.data.vedp_sku
    });
  }

  chkReq(event: any, index: any){
    let rule = event.target?.value
    let type = this.questions[index]!.type

    if(rule == 'R' && type == 'D'){
      (<HTMLInputElement>document.getElementById('dflk' + index + this.questions[index]!.n2no)).checked = true;
      (<HTMLInputElement>document.getElementById('dflk' + index + this.questions[index]!.n2no)).disabled = true;
    } else {
      (<HTMLInputElement>document.getElementById('dflk' + index + this.questions[index]!.n2no)).disabled = false;
    }
  }

  updService(i: any, n2no: any){
    for (let i = 0; i < this.questions?.length; i++) {
      if(this.questions[i].n2no == n2no){
        this.questions[i].dfan = (<HTMLInputElement>document.getElementById('dfan' + i + n2no)).value;
        this.questions[i].dflk = (<HTMLInputElement>document.getElementById('dflk' + i + n2no)).checked ? 'Y' : 'N'
        this.questions[i].dspd = (<HTMLInputElement>document.getElementById('dspd' + i + n2no)).checked ? 'Y' : '';
        this.questions[i].req = (<HTMLInputElement>document.getElementById('req' + i + n2no)).value
      }
    } 
  }

  inqVSMT(v2no: any){
    localStorage.clear();
    
    // let p1 = {
    //   type: this.type,
    //   vedp: this.vedp,
    //   newVedp: this.newVedp,
    //   acno: this.acno,
    //   v1cd: this.v1cd,
    //   name: this.name,
    //   desc: this.desc,
    //   levl: this.levl,
    //   styl: this.styl,
    //   vfgn: this.vfgn,
    //   ctno: this.ctno,
    //   checked: JSON.stringify(this.grpChecked),
    //   processed: this.processed ? 'Y' : '',
    //   questions: JSON.stringify(this.questions),
    //   answers: this.cacheAnswers(),
    //   target: v2no
    // }
    // localStorage.setItem('p1', JSON.stringify(p1));
    // localStorage.setItem('partpg','/uniforms/massappupdate/' + this.page.rfno + '/' + this.newVedp + '/')
    // let menu = '/cgi/APOELMIS4?PAMODE=*INQ&PMVSMT=EMBLEM' + '&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N' 
    // localStorage.setItem('menu',menu)
    // localStorage.setItem('UP_AUTH','Y');
    // this.router.navigate(['/uniforms/iframe/APOELMIS4'])
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

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }
}
