import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { showWait, hideWait } from '../../shared/utils';

@Component({
  selector: 'app-cxml-categories',
  standalone: false,
  templateUrl: './cxml-categories.component.html',
  styleUrl: './cxml-categories.component.css'
})
export class CxmlCategoriesComponent {
  page = new Page();
  level: any = "";
  assign: any = "";
  unsp: any = [];

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this.level = ''
    this.unsp = [];
    hideWait();
    this.page.loading = false;
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getConfigs();
  }

  getConfigs(){
    showWait();
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNAX', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.unspc) this.page.data.unspc = this.page.data.unspc.sort((a: any, b: any) => a.valu.localeCompare(b.valu, 'en', { numeric: true }))
      if (this.page.data?.categories) this.buildUNSP()
      console.log(this.unsp)
      hideWait();
      this.page.loading = false;
    });
  }

  buildUNSP(){
    this.unsp = []
    for (let i = 0; i < this.page.data.categories.length; i++) {
      let value = {
        nano: this.page.data.categories[i].nano,
        unsp: (this.page.data.categories[i].unsp) ?  this.page.data.categories[i].unsp : ''
      }
      this.unsp.push(value.nano + value.unsp)
    }
  }

  selectUNSP(nano: any, event: any){
    for (let i = 0; i < this.unsp.length; i++) {
      let value = {
        nano: this.unsp[i].substring(0,15),
        unsp: this.unsp[i].substring(15)
      }
      if(value.nano == nano){
        value.unsp = event.target.value
        this.unsp[i] = value.nano + value.unsp
      }
    }   
    console.log(this.unsp)
  }

  loadConfigs(){
    showWait();
    let data = {
      mode: 'update',
      nhno: this.page.rfno,
      unsp: this.unsp.toString()
    }
    console.log(data);

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNAX', data).subscribe(response => {
      this.page.data = response;
      this.getConfigs();
    });
  }

  assignAll(){
    showWait();
    let data = {
      mode: 'updateAll',
      nhno: this.page.rfno,
      unsp: this.unsp.toString(),
      assign: this.assign
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNAX', data).subscribe(response => {
      this.page.data = response;
          this.getConfigs();
    });
  }

  filterConfigs(event: any){
    this.getConfigs();
  }
}
