import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Page } from '../../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { showWait, hideWait } from '../../../shared/utils';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-oerp53',
  standalone: false,
  templateUrl: './oerp53.component.html',
  styleUrl: './oerp53.component.css'
})
export class OERP53Component {
  page = new Page();
  errors = "";
  security: any;
  upload = "";
  showEmail = false;

  //Input
  aka: any = "";
  explode: any = "";
  email = "";
  method: any = "";
  format: any = "";

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) { }

  async ngOnInit() {
    localStorage.clear();
    this.security = await this.sessionService.getSession();
    this.showEmail = false;
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getReport();
  }

  getReport(){
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPRP53', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if(this.page.data?.method && !this.method) this.method = this.page.data.method[0].valu
      if(this.page.data?.format && !this.format) this.format = this.page.data.format[0].valu
      hideWait();
      this.page.loading = false;
    });
  }

  toggleEmail(){
    if(this.method == 'EMAIL'){
      this.showEmail = true
    } else this.showEmail = false

    if (this.showEmail){
      this.email = this.security.emal
    } else this.email = ''
  }

validate(){
  if(!this.method){
    let error = 'Reciept Method is Required'
    if(!this.errors){
      this.errors = error
    } else this.errors += ', ' + error
  }
  if(!this.format){
    let error = 'Format is Required'
    if(!this.errors){
      this.errors = error
    } else this.errors += ', ' + error 
  }
  if(this.method == 'EMAIL' && !this.email){
    let error = 'Email Address is Required'
    if(!this.errors){
      this.errors = error
    } else this.errors += ', ' + error
  }
}

  submitReport(){
    this.validate();
    if (this.errors) return
    let data = {
      mode: 'update',
      nhno: this.page.rfno,
      akaQualifier: this.aka,
      explodeSku: this.explode,
      method: this.method,
      format: this.format,
      email: this.email
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPRP53', data).subscribe(response => {
      this.goBack();
    });
  }

  resetFields(){
    this.showEmail = false;
    this.aka = ""
    this.explode = "";
    this.email = "";
    this.method = this.page.data.method[0].valu;
    this.format = this.page.data.format[0].valu;
  }

  goBack(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/export/' + this.page.rfno]);
  }

}
