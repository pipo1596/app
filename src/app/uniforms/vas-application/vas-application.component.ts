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
    this.setMode();
    localStorage.clear();
    this.getApplication();
  }

  getApplication(){
    showWait();
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
      if (this.copy){
        this.desc = 'Copy of ' + this.page.data?.info?.desc;
      } else { this.desc = this.page.data?.info?.desc; }
      if (this.page.data?.mand == 'Y') this.mand = true;
      if (this.page.data?.actv == 'Y') this.actv = true;
      if (this.page.data?.vedp && !this.vedp) this.vedp = this.page.data.vedp;
      if (this.page.data?.vedp_desc) this.vedpDesc = this.page.data.vedp_desc;
      if (this.page.data?.acno) this.acno = this.page.data.vedp;
      if (this.page.data?.v1cd && this.page.editmode) this.v1cd = this.page.data.v1cd
      if (this.page.data?.v1cd_desc) this.v1cdDesc = this.page.data.v1cd_desc
      hideWait();
      this.page.loading = false;
    });
  }

  inqStyle() {
    localStorage.clear();
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
    showWait();

    let data = {
      mode: mode,
      nhno: this.nhno,
      n1no: (mode == 'update') ? this.n1no : '',
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
        this.router.navigate(['/uniforms/vasapplications/' + this.page.data.nhno + '/' + this.npno]);
      }
      this.page.loading = false;
      hideWait();
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
        this.router.navigate(['/uniforms/vasapplications/' + this.page.data.nhno + '/' + this.npno]);
      }
      this.page.loading = false;
      hideWait();
    });
  }
}
