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
  v2type: any = "";
  errors: any = [];
  row: any;
  itemChng: any = false;
  processed: any = false;

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
  questions: any = [];
  grpChecked: any = [];
  pV2NO: any = "";
  pDfan: any = "";
  oldDfan: any = "";
  newDfan: any = "";

  //Vas Items
  acno: any = "";
  vsmt: any = "";
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
      this.vsmt = params.get('vsmt');
    });
    if (localStorage.getItem('p1')) this.getCache();
    if (this.newVedp) this.getVEDP()
    localStorage.clear();
    this.getInfo();
  }

  getCache(){
    if (localStorage.getItem('p1')){
      let p1 = JSON.parse(localStorage.getItem('p1')!);
      this.type = p1.type;
      this.vedp = p1.vedp;
      if(!this.newVedp) this.newVedp = p1.newVedp;
      this.acno = p1.acno;
      this.v1cd = p1.v1cd;
      this.name = p1.name;
      this.desc = p1.desc;
      this.levl = p1.levl;
      this.styl = p1.styl;
      this.vfgn = p1.vfgn;
      this.ctno = p1.ctno;
      this.grpChecked = JSON.parse(p1.checked);
      this.questions = JSON.parse(p1.questions);

      if(p1.processed == 'Y'){
        this.processed = true;
      } else this.processed = false;

      if(p1.answers){
        let answers = JSON.parse(p1.answers)

        for(let i = 0; i < answers?.length; i++){
          this.questions[i].dfan = answers[i].dfan
          this.questions[i].dflk = answers[i].dflk
          this.questions[i].dspd = answers[i].dspd
          this.questions[i].req = answers[i].req
        }
      }

      if(p1.target){
        for(let i = 0; i < this.questions?.length; i++){
          if((this.questions[i].v2no == p1.target) && this.vsmt){
            this.questions[i].dfan = this.vsmt
          }
        }
      }

    }
  }

  cacheAnswers(){
    let answers: any = []

    for (let i = 0; i < this.questions?.length; i++) {
      let question: any = {}
      question.dfan = (<HTMLInputElement>document.getElementById('dfan' + i + this.questions[i]!.v2no)).value;
      question.dflk = (<HTMLInputElement>document.getElementById('dflk' + i + this.questions[i]!.v2no)).checked ? 'Y' : 'N'
      question.dspd = (<HTMLInputElement>document.getElementById('dspd' + i + this.questions[i]!.v2no)).checked ? 'Y' : '';
      question.req = (<HTMLInputElement>document.getElementById('req' + i + this.questions[i]!.v2no)).value
      answers.push(question)
    } 
    return JSON.stringify(answers)
  }

  getInfo(){
    this.row = ''
    this.errors = []
    showWait()
    let data = {
      mode: 'getInfoU',
      nhno: this.page.rfno,
      type: this.type,
      v1cd: this.v1cd,
      v2no: (this.type == 'Q' || this.type == 'I' || this.type == 'S') ? this.v2no : '',
      name: this.name,
      vedp: (this.type == 'V' || this.type == 'I' || this.type == 'S') ? this.vedp : this.vedp?.vedp,
      desc: this.desc,
      levl: this.levl?.valu,
      styl: this.styl?.styl,
      vfgn: this.type == 'S' ? this.vfgn : this.vfgn?.vfgn,
      ctno: this.ctno?.ctno,
      pV2NO: (this.type == 'S') ? this.pV2NO : '',
      pDfan: (this.type == 'S') ? this.pDfan : '',
      oldDfan: (this.type == 'I' || this.type == 'S') ? this.oldDfan : '',
      newDfan: (this.type == 'I' || this.type == 'S') ? this.newDfan : ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAD', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data?.title;
      if (this.page.data?.fullname) this.page.fullname = this.page.data?.fullname;
      if (this.page.data?.menu) this.page.menu = this.page.data?.menu;
      if (this.page.data?.appDrp) this.applications = this.page.data?.appDrp;
      if (this.page.data?.cstmzChk){ 
        this.page.data.cstmzChk = this.page.data?.cstmzChk.sort((a: any,b: any) => a.npno.localeCompare(b.npno))
        this.groups = this.page.data?.cstmzChk;

        if(this.grpChecked?.length == 0){
        for (let x = 0; x < this.page.data?.cstmzChk?.length; x++) {
          this.grpChecked.push(this.page.data?.cstmzChk[x].n1no)
        }
        }
      }

      if (this.page.data?.appDrp){
        this.page.data.appDrp.forEach((app: any) => {
          app.desc = app.desc + ' - ' + app.v1cd
        });
      }

      if (this.page.data?.stylDrop){
        this.page.data.stylDrop = this.page.data?.stylDrop.sort((a: any,b: any) => a.styl.localeCompare(b.styl))
        this.page.data?.stylDrop.forEach((styl: any) => {
          styl.desc = styl.styl + ' - ' + styl.desc
        });
      }

      if (this.page.data?.itemDrop){
        this.page.data?.itemDrop.forEach((item: any) => {
          item.desc = item.desc !== '' ? item.sku + ' - ' + item.desc : item.sku
        });
      }

      if (this.page.data?.vfgnDrop){
        this.page.data?.vfgnDrop.forEach((config: any) => {
          config.desc = config.desc + ' - ' + config.vfgn
        });
      }

      if (this.page.data?.lvlDrop){
        this.page.data.lvlDrop = this.page.data?.lvlDrop.sort((a: any,b: any) => a.valu.localeCompare(b.valu))
      }

      if (this.page.data?.acno) this.acno = this.page.data?.acno
      if (this.page.data?.v1cd && this.type == 'V') this.v1cd = this.page.data?.v1cd
      if (this.page.data?.v2type && (this.type == 'I' || this.type == 'S')) this.v2type = this.page.data?.v2type
      if (this.page.data?.oldDfan && (this.type == 'I' || this.type == 'S')) this.oldDfan = this.page.data?.oldDfan
      if (this.page.data?.vf2pDfan && this.type == 'S') this.pDfan = this.page.data?.vf2pDfan
      if (this.page.data?.vf2pV2NO && this.type == 'S') this.pV2NO = this.page.data?.vf2pV2NO

      if (this.page.data?.result == 'fail'){
        this.errors = this.page.data?.errors.toString().split(",")
        this.v2no = ''
      }

      this.page.loading = false;
      hideWait();
    });
  }

  getInfoV(){
    this.errors = [];
    showWait();
    if(!this.vedp || !this.newVedp){
      this.errors.push('Old and New VAS Items are required')
      hideWait();
      return
    }

    if(this.grpChecked.length == 0){
      this.errors.push('Must select at least one Customization Group')
      return
    }

    this.itemChng = true
    let data = {
      mode: 'process',
      type: this.type,
      nhno: this.page.rfno,
      vedp: this.vedp,
      newVedp: this.newVedp,
      n1noArr: this.grpChecked
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAD', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data?.questions){
        this.questions = this.page.data?.questions.sort((a: any,b: any) => a.v2no.localeCompare(b.v2no))
      }
      if (this.page.data?.itemDrop){
        this.page.data?.itemDrop.forEach((item: any) => {
          item.desc = item.desc !== '' ? item.sku + ' - ' + item.desc : item.sku
        });
      }
      this.processed = true;
      hideWait();
    });
  }

  updateApps(){
    this.errors = [];

    if(this.grpChecked.length == 0){
      this.errors.push('Must select at least one Customization Group')
      return
    }

    if(confirm("Are you sure you want to update all of these?")){
      showWait()
      let data = {
        mode: 'update',
        type: this.type,
        nhno: this.page.rfno,
        v1cd: this.v1cd,
        v2no: this.v2no,
        newDesc: !(this.type == 'I' || this.type == 'S') ? this.newDesc : '',
        newDfan: (this.type == 'I' || this.type == 'S') ? this.newDfan : '',
        n1noArr: this.grpChecked
      }

      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAD', data).subscribe(response => {
        this.page.data = response;
        if (this.page.data?.title) this.page.title = this.page.data.title;
        if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
        if (this.page.data?.menu) this.page.menu = this.page.data.menu;
        if (this.page.data?.result == 'fail'){
          this.errors = this.page.data?.errors.toString().split(",")
          hideWait();
        } else this.errors = []
        this.grpChecked = [];
        this.newDesc = "";
        this.newDfan = "";
        this.getInfo();
      });
    }
  }

  updateAnswers(){
    this.errors = [];
    if(this.grpChecked.length == 0){
      this.errors.push('Must select at least one Customization Group')
      return
    }

    if(!this.newDfan || (this.v2type !== 'P' && this.v2type !== 'I' && !this.oldDfan)){
      if(this.v2type !== 'P' && this.v2type !== 'I') {
        this.errors.push('Current and New Answers are required')
      } else this.errors.push('New Answer is required')
      hideWait();
      return
    }

    if(confirm("Are you sure you want to update all of these?")){
      showWait()
      let data = {
        mode: 'updateA',
        nhno: this.page.rfno,
        type: this.type,
        v1cd: this.v1cd,
        vedp: this.vedp,
        v2no: this.v2no,
        oldDfan: this.oldDfan,
        newDfan: this.newDfan,
        n1noArr: this.grpChecked
      }

      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAD', data).subscribe(response => {
        this.page.data = response;
        if (this.page.data?.title) this.page.title = this.page.data?.title;
        if (this.page.data?.fullname) this.page.fullname = this.page.data?.fullname;
        if (this.page.data?.menu) this.page.menu = this.page.data?.menu;
        if (this.page.data?.result == 'fail'){
          this.errors = this.page.data?.errors.toString().split(",")
        } else this.errors = []
        this.grpChecked = [];
        this.newDfan = ""
        this.oldDfan = ""
        this.v2no = ""
        this.vedp = ""
        this.v1cd = ""
        this.getInfo();
      });
    }
  }

  saveQuestions(){
    showWait();
    let v2no = [];
    let dflk = [];
    let dspd = [];
    let req = [];
    let dfan = [];

    for (let i = 0; i < this.questions?.length; i++) {
      v2no.push(this.questions[i].v2no);
      dflk.push((<HTMLInputElement>document.getElementById('dflk' + i + this.questions[i]!.v2no)).checked ? 'Y' : 'N');
      dspd.push((<HTMLInputElement>document.getElementById('dspd' + i + this.questions[i]!.v2no)).checked ? 'Y' : '');
      req.push((<HTMLInputElement>document.getElementById('req' + i + this.questions[i]!.v2no)).value);
      dfan.push((<HTMLInputElement>document.getElementById('dfan' + i + this.questions[i]!.v2no)).value);
    } 

    let data = {
      mode: 'updateVAS',
      type: this.type,
      nhno: this.page.rfno,
      vedp: this.vedp,
      newVedp: this.newVedp,
      n1noArr: this.grpChecked,
      v2no: v2no,
      dflk: dflk,
      dspd: dspd,
      req: req,
      dfan: dfan
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVAD', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data?.questions) this.questions = this.page.data?.questions
      if (this.page.data?.itemDrop){
        this.page.data?.itemDrop.forEach((item: any) => {
          item.desc = item.desc !== '' ? item.sku + ' - ' + item.desc : item.sku
        });
      }

      if (this.page.data?.result == 'fail'){
        this.errors = this.page.data?.errors.toString().split(",")
      } else {
        this.errors = []
        this.vedp = ""
        this.newVedp = ""
        this.type = ""
        this.clrType();
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

  buildApps(group: any){
    let apps: any = []
    for (let x = 0; x < this.page.data?.cstmzChk?.length; x++) {
      let customization = this.page.data?.cstmzChk[x].npDesc;

      if(this.type == 'Q' || this.type == 'I'){
          let data = {
            n1no: this.page.data?.cstmzChk[x].n1no,
            nv1Desc: this.page.data?.cstmzChk[x].nv1Desc
          }
          apps.push(data);
      } else {
        if(customization == group){
          let data = {
            n1no: this.page.data?.cstmzChk[x].n1no,
            nv1Desc: this.page.data?.cstmzChk[x].nv1Desc
          }
          apps.push(data);
        }
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
    for (let x = 0; x < this.page.data?.cstmzChk?.length; x++) {
      if(!(this.isChecked(this.page.data?.cstmzChk[x].n1no))){
        return false;
      }
    } return true;
  }

  checkAll(){
    var all = this.allChecked()
    for (let i = 0; i < this.page.data?.cstmzChk?.length; i++) {
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
      newVedp: this.newVedp,
      acno: this.acno,
      v1cd: this.v1cd,
      name: this.name,
      desc: this.desc,
      levl: this.levl,
      styl: this.styl,
      vfgn: this.vfgn,
      ctno: this.ctno,
      checked: JSON.stringify(this.grpChecked),
      processed: this.processed ? 'Y' : '',
      questions: JSON.stringify(this.questions)
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
    if (this.type == 'V' && (!this.vedp || this.itemChng || this.processed)) show = false 
    if ((this.type == 'I') && (!this.vedp || !this.v2no || (!this.oldDfan && (this.v2type !== 'P' && this.v2type !== 'I')))) show = false 
    if ((this.type == 'S') && (!this.vfgn || !this.v2no || (!this.oldDfan && (this.v2type !== 'P' && this.v2type !== 'I')))) show = false 
    return show
  }

  clrType() {
    this.errors = []
    this.grpChecked = []
    this.groups = []
    this.vedp = ""
    this.newVedp = ""
    this.newVDesc = ""
    this.newVSku = ""
    this.v1cd = "";
    this.v2no = "";
    this.vfgn = "";
    this.processed = false;
    this.questions = [];
  }

  clrFields() {
    this.errors = []
    this.grpChecked = []
    this.groups = []
    this.newVedp = ""
    this.newVDesc = ""
    this.newVSku = ""
    this.oldDfan = ""
    this.newDfan = ""
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

  inqVSMT(v2no: any){
    localStorage.clear();
    
    let p1 = {
      type: this.type,
      vedp: this.vedp,
      newVedp: this.newVedp,
      acno: this.acno,
      v1cd: this.v1cd,
      name: this.name,
      desc: this.desc,
      levl: this.levl,
      styl: this.styl,
      vfgn: this.vfgn,
      ctno: this.ctno,
      checked: JSON.stringify(this.grpChecked),
      processed: this.processed ? 'Y' : '',
      questions: JSON.stringify(this.questions),
      answers: this.cacheAnswers(),
      target: v2no
    }
    localStorage.setItem('p1', JSON.stringify(p1));
    localStorage.setItem('partpg','/uniforms/massappupdate/' + this.page.rfno + '/' + this.newVedp + '/')
    let menu = '/cgi/APOELMIS4?PAMODE=*INQ&PMVSMT=EMBLEM' + '&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N' 
    localStorage.setItem('menu',menu)
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMIS4'])
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

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }
}
