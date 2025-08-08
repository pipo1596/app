import { Component } from '@angular/core';
import { Page} from '../../shared/textField';
import { environment } from '../../../environments/environment';
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
  copy: any;
  errors: any;

  // Parms
  nhno: any;
  npno: any;
  n1no: any;
  upct = "0";

  // Input
  v1cd: any = "";
  v1cdDesc: any;
  vdno: any = "";
  vedp: any;
  vedpDesc: any;
  desc: any;
  mand: any = false;
  actv: any = false;
  acno: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.copy = localStorage.getItem('copy')
    if(localStorage.getItem('p1')){
      let p1 = JSON.parse(localStorage.getItem('p1')!)
      this.vdno = p1.vdno;
      this.v1cd = p1.v1cd;
      this.desc = p1.desc;
      this.mand = p1.mand;
      this.actv = p1.actv;
    }
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
      vdno: this.vdno 
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.copy && !this.desc){
        this.desc = 'Copy of ' + this.page.data?.info?.desc;
      } else if ( this.page.data?.desc && !this.desc) { this.desc = this.page.data.desc; }
      if (this.page.data?.mand == 'Y' && !this.mand) this.mand = true;
      if (this.page.data?.actv == 'Y' && !this.actv) this.actv = true;
      if (this.page.data?.vedp && !this.vedp) this.vedp = this.page.data.vedp;
      if (this.page.data?.vedp_desc && !this.vedpDesc) this.vedpDesc = this.page.data.vedp_desc;
      if (this.page.data?.acno) this.acno = this.page.data.acno;
      if (this.page.data?.upct) this.upct = this.page.data.upct;
      if (this.page.data?.v1cd && this.page.editmode) this.v1cd = this.page.data.v1cd
      if (this.page.data?.v1cd_desc) this.v1cdDesc = this.page.data.v1cd_desc
      hideWait();
      this.page.loading = false;
    });
  }

  inqStyle() {
    localStorage.clear();
    let p1 = {
      vdno: this.vdno,
      v1cd: this.v1cd,
      desc: this.desc,
      mand: this.mand,
      actv: this.actv
    }
    localStorage.setItem('p1', JSON.stringify(p1));
    if(this.page.editmode){
      localStorage.setItem('partpg','/uniforms/vasapplication/' + this.nhno + '/' + this.npno + '/' + this.n1no + '/')
    } else {
      localStorage.setItem('partpg','/uniforms/newvasapplication/' + this.nhno + '/' + this.npno + '/')
    }
    let menu = '/cgi/APOELMIS2?PAMODE=*INQ&PMV1CD=' + this.v1cd + '&PMACNO=' + this.acno + '&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N' 
    localStorage.setItem('menu', menu)
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMIS2'])
  }

  getVEDP(){
    let data = {
      mode: 'getvedp',
      vedp: this.vedp
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.vedp_desc) this.vedpDesc = this.page.data.vedp_desc
    });

  }

  setMode() {
    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.npno = params.get('npno')
      this.n1no = params.get('n1no')
      this.vedp = params.get('vedp')
    });

    if (this.n1no && !this.copy) {
      this.page.editmode = true;
      this.page.entrymode = false;
    } else { 
      this.page.entrymode = true;
      this.page.editmode = false;
    }

  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
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
      vdno: this.vdno,
      vedp: this.vedp,
      desc: this.desc,
      actv: this.actv ? 'Y' : '',
      mand: this.mand ? 'Y' : '',
      upct: (mode == 'update') ? this.upct : ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data?.upct) this.upct = this.page.data.upct;

      if (this.page.data.result == 'pass'){
        localStorage.setItem('UP_AUTH','Y');
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
        this.router.navigate(['/uniforms/vasapplications/' + this.nhno + '/' + this.npno]);
      }
      this.page.loading = false;
      hideWait();
    });
  }
}
