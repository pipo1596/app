import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { showWait, hideWait } from '../../shared/utils';

@Component({
  selector: 'app-cxml-customers',
  standalone: false,
  templateUrl: './cxml-customers.component.html',
  styleUrl: './cxml-customers.component.css'
})
export class CxmlCustomersComponent {
  page = new Page();
  level: any = "";
  acno: any = "";

  //Paging
  p: number = 1;
  itemsPerPage: number = 10;
  total: number = 0;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.level = ''
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
      nhno: this.page.rfno,
      acno: this.acno,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMCGU', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.total) this.total = this.page.data.total
      hideWait();
      this.page.loading = false;
    });
  }

  filterConfigs(event: any){
    this.acno = event.target.value
    this.getConfigs();
  }

  editConfig(guno: any){
    this.router.navigate(['/uniforms/cxmlcustomer/' + this.page.rfno + '/' + guno]);
  }

  newConfig(){
      this.router.navigate(['/uniforms/cxmlcustomer/' + this.page.rfno]);
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getConfigs()
  }

  onPageChange(event: number) {
    this.p = event
    this.getConfigs()
  }
}
