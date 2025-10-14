import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { showWait, hideWait } from '../../shared/utils';

@Component({
  selector: 'app-vas-question',
  standalone: false,
  templateUrl: './vas-question.component.html',
  styleUrl: './vas-question.component.css'
})
export class VasQuestionComponent {
  page = new Page();
  errors: any;
  application: any;
  npno: any;
  n2no: any;
  type: any;
  all: any;

  //Input
  desc: any; // Description
  seq: any = ""; // Sequence
  actv: any = ""; // Active
  mini: any; // Min Length
  maxi: any; // Max Length
  rsli: any; // Restriction List
  minr: any; // Range Min
  maxr: any; // Range Max
  decr: any; // Range Dec Precision
  incr: any; // Range Increment
  vhno: any; // Droplist
  vhdesc: any; // Droplist Desc
  vsmt: any; // VAS Material Type
  dfan: any = ""; // Default Answer
  pdfan: any = ""; // Default if no Parent found
  dspd: any = ""; // Display Defaulted Locked Answer
  qty: any; // Inventory Qty
  lkqt: any = ""; // Lock Inventory Qty
  dflk: any = ""; // Force Default
  rule: any = ""; // Rule
  ruleVF: any = ""; // Rule
  afmt: any = ""; // VAS Answer FOrmat
  upct: any; 

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('allexpand')){
      this.all = localStorage.getItem('allexpand')
    }

    if(localStorage.getItem('ruleVF')){
      this.ruleVF = localStorage.getItem('ruleVF')
    }

    if(localStorage.getItem('vasApp')){
      this.application = JSON.parse(localStorage.getItem('vasApp')!);
    } else if(localStorage.getItem('p1')){
      this.application = JSON.parse(localStorage.getItem('p1')!);
    }

    if(localStorage.getItem('p2') && !this.all){
      this.all = localStorage.getItem('p2')
    }

    if(localStorage)
    localStorage.clear();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.npno = params.get('npno');
      this.vhno = params.get('vhno');
    });
    this.getQuestion();
  }

  getQuestion(){
    showWait();
    if(this.vhno) this.getVHNO()
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      npno: this.npno,
      n1no: this.application?.n1no, 
      n2no: this.application?.n2no,
      v1cd: this.application?.v1cd,
      v2no: this.application?.v2no 
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV2', data).subscribe(response => {
      this.page.data = response;

      //Input
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.info?.nv2type) this.type = this.page.data.info.nv2type;
      if (this.page.data?.info?.desc) this.desc = this.page.data.info.desc;
      if (this.page.data?.info?.seq) this.seq = this.page.data.info.seq;
      if (this.page.data?.info?.actv) this.actv = this.page.data.info.actv;
      if (this.page.data?.info?.mini) this.mini = this.page.data.info.mini;
      if (this.page.data?.info?.maxi) this.maxi = this.page.data.info.maxi;

      if (this.vhno && this.type == 'P') this.rsli = this.vhno;
      if (this.page.data?.info?.rsli && !this.rsli) this.rsli = this.page.data.info.rsli;
      if (this.page.data?.info?.vh2vhdesc && !this.vhdesc) this.vhdesc = this.page.data?.info?.vh2vhdesc;
      if (this.page.data?.info?.vh1vhdesc && !this.vhdesc) this.vhdesc = this.page.data?.info?.vh1vhdesc;
      if (this.page.data?.info?.minr) this.minr = this.page.data.info.minr;
      if (this.page.data?.info?.maxr) this.maxr = this.page.data.info.maxr;
      if (this.page.data?.info?.decr) this.decr = this.page.data.info.decr;
      if (this.page.data?.info?.incr) this.incr = this.page.data.info.incr;
      if (this.page.data?.info?.tbld && !this.vhno) this.vhno = this.page.data.info.tbld;

      if (this.page.data?.info?.vsmt) this.vsmt = this.page.data.info.vsmt;
      if (this.page.data?.info?.dfan !== "") this.dfan = this.page.data.info.dfan;
      if (this.page.data?.info?.pdfan !== "") this.pdfan = this.page.data.info.pdfan;
      if (this.page.data?.info?.qty) this.qty = this.page.data.info.qty;
      if (this.page.data?.info?.rule) this.rule = this.page.data.info.rule;
      if (this.page.data?.info?.afmt) this.afmt = this.page.data.info.afmt;
      if (this.page.data?.info?.dspd) this.dspd = this.page.data.info.dspd;
      if (this.page.data?.info?.lkqt) this.lkqt = this.page.data.info.lkqt;
      if (this.page.data?.info?.dflk) this.dflk = this.page.data.info.dflk;
      if (this.page.data?.info?.upct) this.upct = this.page.data.info.upct;

      //Dropdowns
      if (this.page.data?.seqDrop){
        this.page.data.seqDrop = this.page.data.seqDrop.sort((a: any, b: any) => a.value.localeCompare(b.value));
      }

      if (this.page.data?.vsmtDrop){
        this.page.data.vsmtDrop = this.page.data.vsmtDrop.sort((a: any, b: any) => a.value.localeCompare(b.value));
      }

      hideWait();
      this.page.loading = false;
    });
  }

  getVHNO(){
    let data = {
      mode: 'getVhno',
      vhno: this.vhno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV2', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.vh_desc) this.vhdesc = this.page.data.vh_desc
    });
  }

  loadQuestion(){
    this.errors = "";
    let data = {
      mode: 'update',
      nhno: this.page.rfno,
      npno: this.npno,
      n1no: this.application?.n1no, 
      n2no: this.application?.n2no,
      v1cd: this.application?.v1cd,
      v2no: this.application?.v2no,
      type: this.type, 
      desc: this.desc, // Description
      seq:  this.seq, // Sequence
      actv: this.actv, // Active
      mini: this.mini, // Min Length
      maxi: this.maxi, // Max Length
      rsli: this.rsli, // Restriction List
      minr: this.minr, // Range Min
      maxr: this.maxr, // Range Max
      decr: this.decr, // Range Dec Precision
      incr: this.incr, // Range Increment
      tbld: this.vhno, // Droplist
      vsmt: this.vsmt, // Vas Material Type
      dfan: this.dfan, // Default Answer
      pdfan:this.pdfan, // Default if no Parent found
      dspd: this.dspd, // Display Defaulted Locked Answer
      qty:  this.qty, // Inventory Qty
      lkqt: this.lkqt, // Lock Inventory Qty
      dflk: this.dflk, // Force Default
      rule: this.rule, // Rule
      afmt: this.afmt, // Vas Answer Format
      upct: this.upct
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV2', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data?.upct) this.upct = this.page.data.upct;

      if (this.page.data.result == 'pass'){
        localStorage.setItem('UP_AUTH','Y');
        localStorage.setItem('allexpand',this.all ? 'Y' : '');
        this.router.navigate(['/uniforms/vasapplications/' + this.page.rfno + '/' + this.npno]);
      } else {
        this.errors = this.page.data.errors
        this.getQuestion();
      }
    });
  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  inqDrop() {
    localStorage.clear();
    localStorage.setItem('p1',JSON.stringify(this.application));
    localStorage.setItem('p2',this.all ? 'Y' : '');
    let menu = '/cgi/APOELMVH?PAMODE=*INQ&PMV1CD=' + this.application.v1cd + '&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N'
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('partpg','/uniforms/vasquestion/' + this.page.rfno + '/' + this.npno + '/');
    localStorage.setItem('menu',menu);
    this.router.navigate(['/uniforms/iframe/APOELMVH']);
  }

  inqDfan() {
    localStorage.clear();
    localStorage.setItem('p1',JSON.stringify(this.application));
    localStorage.setItem('p2',this.all ? 'Y' : '');
    let menu = '/cgi/APOELMIS4?PAMODE=*INQ&PMV1CD=' + this.application.v1cd + '&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N'
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('partpg','/uniforms/vasquestion/' + this.page.rfno + '/' + this.npno + '/');
    localStorage.setItem('menu',menu);
    this.router.navigate(['/uniforms/iframe/APOELMVH']);
  }

  goBack(){
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('allexpand',this.all ? 'Y' : '');
    this.router.navigate(['/uniforms/vasapplications/' + this.page.rfno + '/' + this.npno]);
  }

}
