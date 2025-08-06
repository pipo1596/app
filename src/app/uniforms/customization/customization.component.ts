import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-customization',
  standalone: false,
  templateUrl: './customization.component.html',
  styleUrl: './customization.component.css'
})

export class CustomizationComponent {
  page = new Page();
  drop = false; // More Actions
  copy: any;

  // Parms
  nhno: any;
  npno: any;
  upct = "0";

  // Input
  name: any;
  desc: any;
  vfgn: any = "";
  vfgdesc: any = "";
  ctno: any = "";
  ctdesc: any = "";
  effd: any = "";
  // effdUsa: any;
  expd: any = "";
  // expdUsa: any;
  seq: any = "";
  actv: any;


  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    showWait();
    this.setMode();

    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      npno: this.npno,
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNP', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.info.name) this.name = this.page.data.info.name
      if (this.copy){
        this.desc = 'Copy of ' + this.page.data?.info?.desc;
      } else { this.desc = this.page.data?.info?.desc; }
      if (this.page.data?.info.vfgn && !this.vfgn) this.vfgn = this.page.data.info.vfgn
      if (this.page.data?.info.vfgdesc && !this.vfgdesc) this.vfgdesc = this.page.data.info.vfgdesc
      if (this.page.data?.info.ctno && !this.ctno ) this.ctno = this.page.data.info.ctno
      if (this.page.data?.info.ctdesc && !this.ctdesc ) this.ctdesc = this.page.data.info.ctdesc
      if (this.page.data?.info.effd){
        this.effd = this.page.data.info.effd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        // this.effdUsa = this.page.data.info.effd.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
      }
      if (this.page.data?.info.expd){
        this.expd = this.page.data.info.expd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        // this.expdUsa = this.page.data.info.expd.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
      }
      if (this.page.data?.info.seq) this.seq = this.page.data.info.seq
      if (this.page.data?.info.stat) this.actv = this.page.data.info.stat
      if (this.page.data?.info.upct) this.upct = this.page.data.info.upct
      this.page.loading = false;
      hideWait();
    });

    this.page.loading = false;
    hideWait();
  }

  setMode() {
    this.copy = localStorage.getItem('copy')
  
    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.npno = params.get('npno')
      this.vfgn = params.get('vfgn')
    });

    if (this.vfgn !== "") this.getVFGN()

    if (this.npno && !this.copy) {
      this.page.editmode = true;
      this.page.entrymode = false;
    } else { 
      this.page.entrymode = true;
      this.page.editmode = false;
    }
  }

  getVFGN(){
    let data = {
      nhno: this.nhno,
      mode: 'getVfgn',
      vfgn: this.vfgn
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNP', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.vfg_desc) this.vfgdesc = this.page.data.vfg_desc
      if (this.page.data.ctno) this.ctno = this.page.data.ctno
      if (this.page.data.ct_desc) this.ctdesc = this.page.data.ct_desc
    });
  }

  inqVfg() {
    localStorage.clear();
    if(this.page.editmode){
      localStorage.setItem('partpg','/uniforms/customization/' + this.nhno + '/' + this.npno + '/')
    } else {
      localStorage.setItem('partpg','/uniforms/newcustomization/' + this.nhno + '/')
    }
    let menu = '/cgi/APOELMVFG?PAMODE=*INQ&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N' 
    localStorage.setItem('menu', menu)
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMVFG'])
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.nhno]);
  }

  loadProduct(mode: string){
    showWait();
    let data = {}

    if(mode == 'delete'){
      data = {
        mode: mode,
        nhno: this.nhno,
        npno: this.npno
      }
    } else {
      data = {
        mode: mode,
        nhno: this.nhno,
        npno: this.npno,
        name: this.name,
        desc: this.desc,
        ctno: this.ctno,
        vfgn: this.vfgn,
        effd: this.effd.replaceAll('-',''),
        expd: this.expd.replaceAll('-',''),
        seq: this.seq,
        stat: (this.actv == 'Y') ? this.actv : '',
        upct: (mode == 'update') ? this.upct : ''
      }
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNP', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data?.upct) this.upct = this.page.data.upct;

      if (this.page.data.result == 'pass' && this.page.data.nhno){
        localStorage.setItem('UP_AUTH','Y');
        this.router.navigate(['/uniforms/customizations/' + this.page.data.nhno]);
      }

      this.page.loading = false;
      hideWait();
    });

  }
}
