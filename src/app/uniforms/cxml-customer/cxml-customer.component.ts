import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { showWait, hideWait } from '../../shared/utils';

@Component({
  selector: 'app-cxml-customer',
  standalone: false,
  templateUrl: './cxml-customer.component.html',
  styleUrl: './cxml-customer.component.css'
})
export class CxmlCustomerComponent {
  page = new Page();
  mode: any;
  submitError: any;
  showCCNC = false;
  showCCNS = false;
  guno: any;
  acno: any = "";
  dflt: any;
  ccnm: any = "";
  ccnc: any = "";
  ccns: any = "";
  unsp: any;
  upct: any;
  

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.showCCNC = false;
    this.showCCNS = false;
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      if(params.get('guno')){
        this.guno = params.get('guno')
        this.mode = 'update'
      } else this.mode = 'create'
      if(params.get('acno')) this.acno = params.get('acno');
    });
    if(localStorage.getItem('error')) this.submitError = localStorage.getItem('error')
    localStorage.clear()
    showWait();
        let data = {
          mode: 'getInfo',
          nhno: this.page.rfno,
          guno: this.guno,
          ccnm: this.ccnm,
          ccnc: this.ccnc,
          ccns: this.ccns
        }

        this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRCGU', data).subscribe(response => {
          this.page.data = response;
          if (this.page.data?.title) this.page.title = this.page.data.title;
          if (this.page.data?.menu) this.page.menu = this.page.data.menu;
          if (this.page.data?.info?.acno){
            if(this.page.data?.info.acno == '*DEFAULT'){
              this.acno = ''
              this.dflt = true
            } else {
              this.acno = this.page.data?.info?.acno
              this.dflt = false
            }
          }

          if (this.page.data?.info?.ccnm){
            this.ccnm = this.page.data.info.ccnm;
            this.showCCNC = true;
          }

          if (this.page.data?.info?.ccnc){
            this.ccnc = this.page.data.info.ccnc;
            this.showCCNS = true;
          } 

          if (this.page.data?.info?.ccns){
            this.ccns = this.page.data.info.ccns;
          }
          
          if (this.page.data?.merchCategory) this.page.data.merchCategory = this.page.data.merchCategory.sort((a: any,b: any) => a.ccnm.localeCompare(b.ccnm))
          if (this.page.data?.category) this.page.data.category = this.page.data.category.sort((a: any,b: any) => a.ccnc.localeCompare(b.ccnc))
          if (this.page.data?.productClass) this.page.data.productClass = this.page.data.productClass.sort((a: any,b: any) => a.ccns.localeCompare(b.ccns))
          if (this.page.data?.info?.unsp) this.unsp = this.page.data.info.unsp;
          if (this.page.data?.info?.upct) this.upct = this.page.data.info.upct;
          hideWait();
          this.page.loading = false;
        }); 
  }

  getCCNM(){
      this.ccnc = ''
      this.ccns = ''
      this.showCCNC = false;
      this.showCCNS = false;
      
    if (!this.ccnm){
      this.ccnm = ''
    } else {
        let data = {
          mode: 'getInfo',
          nhno: this.page.rfno,
          guno: this.guno,
          ccnm: this.ccnm
        }
        this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRCGU', data).subscribe(response => {
          this.page.data = response;
          this.showCCNC = true;
          if (this.page.data?.merchCategory) this.page.data.merchCategory = this.page.data.merchCategory.sort((a: any,b: any) => a.ccnm.localeCompare(b.ccnm))
          if (this.page.data?.category) this.page.data.category = this.page.data.category.sort((a: any,b: any) => a.ccnc.localeCompare(b.ccnc))
          if (this.page.data?.productClass) this.page.data.productClass = this.page.data.productClass.sort((a: any,b: any) => a.ccns.localeCompare(b.ccns))
          hideWait();
          this.page.loading = false;
        }); 
    }
  }

  getCCNC(){
      this.ccns = ''
      this.showCCNS = false;

    if (!this.ccnc){
      this.ccnc = ''
    } else {
        let data = {
          mode: 'getInfo',
          nhno: this.page.rfno,
          guno: this.guno,
          ccnm: this.ccnm,
          ccnc: this.ccnc
        }
        this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRCGU', data).subscribe(response => {
          this.page.data = response;
          this.showCCNS = true;
          if (this.page.data?.merchCategory) this.page.data.merchCategory = this.page.data.merchCategory.sort((a: any,b: any) => a.ccnm.localeCompare(b.ccnm))
          if (this.page.data?.category) this.page.data.category = this.page.data.category.sort((a: any,b: any) => a.ccnc.localeCompare(b.ccnc))
          if (this.page.data?.productClass) this.page.data.productClass = this.page.data.productClass.sort((a: any,b: any) => a.ccns.localeCompare(b.ccns))
          hideWait();
          this.page.loading = false;
        }); 
    }
  }

  submitConfig(mode: any){
    let data = {
      mode: mode,
      nhno: this.page.rfno,
      guno: this.guno,
      acno: this.acno,
      dflt: (this.dflt) ? 'Y' : 'N',
      ccnm: this.ccnm,
      ccnc: this.ccnc,
      ccns: this.ccns,
      unsp: this.unsp,
      upct: this.upct
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRCGU', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.result == 'pass'){
        this.goBack();
      } else {
        localStorage.setItem('error', 'Record not found');
        localStorage.setItem('UP_AUTH','Y');
        this.router.navigate(['/uniforms/cxmlcustomer/' + this.page.rfno]);
      }
    });
    
  }

  goBack(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/cxmlcustomers/' + this.page.rfno]);
  }

}
