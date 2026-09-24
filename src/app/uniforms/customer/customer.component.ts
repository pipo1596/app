import { Component} from '@angular/core';
import { Page} from '../../shared/textField';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-customer',
  standalone: false,
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  page = new Page();
  drop = false; // More Actions

  // Parms
  nhno:any
  acno:any
  effd = "";
  expd = "";
  upct = "";
  errors = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public layout: LayoutService
) { }

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.setMode();
    this.getCustomer();
  }

  getCustomer(){
    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      acno: this.acno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNC', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.pgName) this.layout.setProgram(this.page.rfno, this.page.data.pgName);
      if (this.page.data?.title) this.layout.setTitle(this.page.data.title)
      if (this.page.data?.menu) this.layout.setMenu(this.page.data.menu)
      if(this.page.data?.info?.acno) this.acno = this.page.data.info.acno;
      if(this.page.data?.info?.effd){
        this.effd = this.page.data.info.effd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
      }
      if(this.page.data?.info?.expd){
        this.expd = this.page.data.info.expd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
      }
      if(this.page.data?.info?.upct) this.upct = this.page.data.info.upct;
      hideWait();
      this.page.loading = false;
    });
  }

  setMode() {
    if (this.router.url.indexOf('/uniforms/newcustomer') >= 0) {
      this.page.entrymode = true;
    }
    if (this.router.url.indexOf('/uniforms/editcustomer') >= 0) {
      this.page.editmode = true;
    }
    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.acno = params.get('acno')
    });
    localStorage.clear();
  }

  inqAcct() {
    let keepPartpg = localStorage.getItem('partpg');
    localStorage.clear();
    if (keepPartpg) localStorage.setItem('partpg',keepPartpg)
    if(this.page.editmode){
      localStorage.setItem('p1', this.acno);
      localStorage.setItem('iframepg','/uniforms/editcustomer/' + this.nhno + '/');
    } else {
      localStorage.setItem('iframepg','/uniforms/newcustomer/' + this.nhno + '/');
    }

    localStorage.setItem('menu','/cgi/APOELMAC?PAMODE=*INQ&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N');
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMAC']);
  }

  loadCustomer(mode: string){
    this.errors = "";
    showWait();

    let data = {
      mode: mode,
      nhno: this.nhno,
      acno: this.acno,
      effd: (mode !== 'delete') ? this.effd.replaceAll('-','') : '',
      expd: (mode !== 'delete') ? this.expd.replaceAll('-','') : '',
      upct: (mode == 'update') ? this.upct : ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNC', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data?.upct) this.upct = this.page.data.upct;

      if (mode !== 'update' && this.page.data?.result == 'pass' && this.page.data?.nhno){
        localStorage.setItem('UP_AUTH','Y');
        this.router.navigate(['/uniforms/customers/' + this.page.data?.nhno]);
      } else if (mode == 'update' && this.page.data?.result == 'pass'){
        localStorage.setItem('UP_AUTH','Y');
        this.router.navigate(['/uniforms/customers/' + this.page.data?.nhno]);
      } else if (this.page.data?.result !== 'pass'){
        this.errors = this.page.data?.errors
        this.setMode();
        this.getCustomer();
      }
      this.page.loading = false;
      hideWait();
    });
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customers/' + this.nhno]);
  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }
}
