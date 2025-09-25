import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  page = new Page();
  drop = false;
  titl = "";
  mode: any;
  name: any;
  effd: any;
  expd: any;
  upct: any;
  errors: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.setMode();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getInfo();
  }

  getInfo(){
    showWait();
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNH', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if(this.page.data?.info?.name){
        this.name = this.page.data?.info?.name
      }
      if(this.page.data?.info?.effd){
        this.effd = this.page.data?.info?.effd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
      }
      if(this.page.data?.info?.expd){
        this.expd = this.page.data?.info?.expd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
      }
      if (this.page.data?.info?.upct) this.upct = this.page.data.info.upct;
      this.page.loading = false;
      hideWait();
    });
  }

  loadUP(){
    showWait();
    this.errors = "";
    let data = {
      mode: 'dash',
      nhno: this.page.rfno,
      name: this.name,
      effd: this.effd?.replaceAll('-',''),
      expd: this.expd?.replaceAll('-',''),
      upct: this.upct
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNH', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if(this.page.data?.name){
        this.name = this.page.data?.name
      }
      if(this.page.data?.effd){
        this.effd = this.page.data?.effd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
      }
      if(this.page.data?.expd){
        this.expd = this.page.data?.expd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
      }
      if (this.page.data?.upct) this.upct = this.page.data?.upct;

      if(this.page.data?.result == 'pass'){
        this.router.navigate(['/uniforms/dashboard/' + this.page.data?.nhno]);
      } else {
        this.errors = this.page.data?.errors
        this.page.loading = false;
        hideWait();
      }
    });
  }

  setMode(){
    if (this.router.url.indexOf('/uniforms/upname') >= 0) {
      this.mode = 'name'
      this.titl = 'Name'
    } else if (this.router.url.indexOf('/uniforms/upeffd') >= 0) {
      this.mode = 'effd'
      this.titl = 'Start Date'
    } else if (this.router.url.indexOf('/uniforms/upexpd') >= 0) {
      this.mode = 'expd'
      this.titl = 'Expiration Date'
    }
  }

  goBack(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/dashboard/' + this.page.rfno]);
  }

}
