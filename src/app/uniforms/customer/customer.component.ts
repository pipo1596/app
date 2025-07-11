import { Component} from '@angular/core';
import { Page} from '../../shared/textField';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

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
  effdUsa: any;
  expd = "";
  expdUsa: any;
  upct = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
) { }

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.setMode();

    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      acno: this.acno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNC', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if(this.page.data?.info?.acno) this.acno = this.page.data.info.acno;
      if(this.page.data?.info?.effd){
        this.effd = this.page.data.info.effd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        this.effdUsa = this.page.data.info.effd.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
      }
      if(this.page.data?.info?.expd){
        this.expd = this.page.data.info.expd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
        this.expdUsa = this.page.data.info.expd.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
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
    localStorage.clear();
    if(this.page.editmode){
      localStorage.setItem('p1', this.acno);
      localStorage.setItem('partpg','/uniforms/editcustomer/' + this.nhno + '/');
    } else {
      localStorage.setItem('partpg','/uniforms/newcustomer/' + this.nhno + '/');
    }

    localStorage.setItem('menu','/cgi/APOELMAC?PAMODE=*INQ&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N');
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMAC']);
  }

  loadCustomer(mode: string){
    showWait();

    let data = {
      mode: mode,
      nhno: this.nhno,
      acno: this.acno,
      effd: (mode !== 'delete') ? this.effdUsa : '',
      expd: (mode !== 'delete') ? this.expdUsa : '',
      upct: (mode == 'update') ? this.upct : ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNC', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data?.upct) this.upct = this.page.data.upct;

      if (mode !== 'update') {
        if (this.page.data.result == 'pass' && this.page.data.nhno){
          localStorage.setItem('UP_AUTH','Y');
          this.router.navigate(['/uniforms/customers/' + this.page.data.nhno]);
        }
      }
      this.page.loading = false;
      hideWait();
    });
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customers/' + this.nhno]);
  }
}
