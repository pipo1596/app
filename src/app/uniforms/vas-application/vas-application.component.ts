import { Component } from '@angular/core';
import { Page} from '../../shared/textField';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-vas-application',
  standalone: false,
  templateUrl: './vas-application.component.html',
  styleUrl: './vas-application.component.css'
})

export class VasApplicationComponent {
  page = new Page();
  drop = false; // More Actions
  dropship = false; 
  single = false; 
  copy: any;
  errors: any;

  // Parms
  nhno: any;
  npno: any;
  n1no: any;
  imgprfx = environment.logoprfx;
  upct = "0";
  nino: any;

  // Input
  v1cd: any = "";
  v1cdDesc: any;
  dscx: any = "";
  vedp: any;
  vedpDesc: any;
  vedpSku: any;
  desc: any;
  mand: any;
  actv: any;
  acno: any;
  seq = "1";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.setMode();
    localStorage.clear();
    this.getApplication();
  }

  getApplication(){
    showWait();
    if(this.vedp) this.getVEDP()
    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      npno: this.npno,
      n1no: this.n1no,
      dscx: this.dscx 
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.copy && !this.desc){
        this.desc = 'Copy of ' + this.page.data?.info?.desc;
      } else if ( this.page.data?.desc && !this.desc) { this.desc = this.page.data.desc; }
      if (this.page.data?.mand == 'Y' && !this.mand) this.mand = 'Y';
      if (this.page.data?.actv == 'Y' && !this.actv) this.actv = 'Y';
      if (this.page.data?.vedp && !this.vedp) this.vedp = this.page.data.vedp;
      if (this.page.data?.vedp_desc && !this.vedpDesc) this.vedpDesc = this.page.data.vedp_desc;
      if (this.page.data?.vedp_sku && !this.vedpSku) this.vedpSku = this.page.data.vedp_sku;
      if (this.page.data?.acno) this.acno = this.page.data.acno;
      if (this.page.data?.upct) this.upct = this.page.data.upct;
      if (this.page.data?.dropship == 'Y') this.dropship = true;
      if (this.page.data?.single == 'Y') this.dropship = true;
      if (this.page.data?.v1cd && this.page.editmode) this.v1cd = this.page.data.v1cd
      if (this.page.data?.v1cd_desc) this.v1cdDesc = this.page.data.v1cd_desc
      if (this.page.data?.v1cd && this.page.entrymode){
        this.page.data.v1cd.forEach((app: any) => {
          app.desc = app.desc + ' - ' + app.valu
        });
      }
      if(this.page.data?.vdno){
        this.page.data.vdno = this.page.data.vdno.sort((a: any,b: any) => a.valu.localeCompare(b.valu))
      }
      if (this.page.data?.seq && this.page.data?.seq !== '0') this.seq = this.page.data.seq
      hideWait();
      this.page.loading = false;
    });
  }

  inqItem() {
    localStorage.clear();
    if(this.nino) localStorage.setItem('p2',this.nino)
    let p1 = {
      dscx: this.dscx,
      v1cd: this.v1cd,
      desc: this.desc,
      mand: this.mand,
      actv: this.actv,
      vedp: this.vedp
    }
    localStorage.setItem('p1', JSON.stringify(p1));
    if(this.page.editmode){
      localStorage.setItem('partpg','/uniforms/vasapplication/' + this.nhno + '/' + this.npno + '/' + this.n1no + '/')
    } else {
      localStorage.setItem('partpg','/uniforms/newvasapplication/' + this.nhno + '/' + this.npno + '/')
    }
    let menu = '/cgi/APOELMIS2?PAMODE=*INQ&PMV1CD=' + this.v1cd + '&PMACNO=' + this.acno + '&PMDROP=' + (this.dropship ? 'Y' : '') + '&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N' 
    localStorage.setItem('menu', menu)
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMIS2'])
  }

  getVEDP(){
    let data = {
      nhno: this.nhno,
      mode: 'getvedp',
      vedp: this.vedp
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.vedp_desc) this.vedpDesc = this.page.data.vedp_desc
      if (this.page.data?.vedp_sku) this.vedpSku = this.page.data.vedp_sku
    });

  }

  clearItem() {
    this.vedp = ""
    this.vedpDesc = ""
    this.vedpSku = ""

    if(!this.vedp){
      let temp = new Page();
      let data = {
        nhno: this.nhno,
        mode: 'getDflt',
        v1cd: this.v1cd
      }
      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
        temp.data = response;
        if (temp.data?.vedp_desc) this.vedpDesc = temp.data?.vedp_desc
        if (temp.data?.vedp_sku) this.vedpSku = temp.data?.vedp_sku
        if (temp.data?.vedp) this.vedp = temp.data?.vedp
      });
    }
  }

  setMode() {

    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.npno = params.get('npno')
      this.n1no = params.get('n1no')
      if(!this.vedp) this.vedp = params.get('vedp')
    });

    this.copy = localStorage.getItem('copy')

    this.nino = localStorage.getItem('nino')
    if(localStorage.getItem('p2')){
      this.nino = localStorage.getItem('p2')
    }

    if(localStorage.getItem('p1')){
      let p1 = JSON.parse(localStorage.getItem('p1')!)
      this.dscx = p1.dscx;
      this.v1cd = p1.v1cd;
      this.desc = p1.desc;
      this.mand = p1.mand;
      this.actv = p1.actv;
      if(!this.vedp) this.vedp = p1.vedp;
    }

    if (this.n1no && !this.copy) {
      this.page.editmode = true;
      this.page.entrymode = false;
    } else { 
      this.page.entrymode = true;
      this.page.editmode = false;
      if(!localStorage.getItem('p1')) this.mand = 'Y'
    }

  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    if(this.nino) localStorage.setItem('nino',this.nino)
    this.router.navigate(['/uniforms/vasapplications/' + this.nhno + '/' + this.npno]);
  }

  loadApp(mode: string){
    this.errors = ""
    showWait();

    let data = {
      mode: mode,
      nhno: this.nhno,
      n1no: (mode == 'update' || this.copy) ? this.n1no : '',
      npno: this.npno,
      v1cd: this.v1cd,
      dscx: this.dscx,
      vedp: this.vedp,
      desc: this.desc,
      actv: this.actv == 'Y' ? 'Y' : '',
      mand: this.mand == 'Y' ? 'Y' : '',
      upct: (mode == 'update') ? this.upct : '',
      drop: (this.dropship) ? 'Y': '',
      single: (this.single) ? 'Y': '',
      seq: this.seq
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data?.upct) this.upct = this.page.data.upct;

      if (this.page.data.result == 'pass'){
        localStorage.setItem('UP_AUTH','Y');
        if(this.nino) localStorage.setItem('nino',this.nino)
        this.router.navigate(['/uniforms/vasapplications/' + this.nhno + '/' + this.npno]);
      } else {
        this.errors = this.page.data.errors
        this.getApplication();
      }
    });
  }

  deleteApp(){
    showWait();

    let data = {
      mode: 'delete',
      nhno: this.nhno,
      n1no: this.n1no,
      npno: this.npno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.result == 'pass'){
        localStorage.setItem('UP_AUTH','Y');
        if(this.nino) localStorage.setItem('nino',this.nino)
        this.router.navigate(['/uniforms/vasapplications/' + this.nhno + '/' + this.npno]);
      }
      this.page.loading = false;
      hideWait();
    });
  }
}
