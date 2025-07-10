import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait, convertToDate, formatDateUS } from '../../shared/utils';

@Component({
  selector: 'app-customers',
  standalone: false,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  page = new Page();
  drop = false; // More Actions 

  //Search
  acno = ""

  //Paging
  p: number = 1;
  itemsPerPage: number = 10;
  total: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getCustomers(this.acno);
  }

  getCustomers(acct: string) {
    this.acno = acct
    showWait();
    let data = {
      nhno: this.page.rfno,
      acno: this.acno,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }
    
    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNC', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.total) this.total = this.page.data.total;
      this.page.loading = false;
      hideWait();
    });
  }

  editCustomer(acno: string) {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/editcustomer/' + this.page.rfno + '/' + acno]);
  }

  deleteCustomer(acno: string){
    showWait();

    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      acno: acno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNC', data).subscribe(response => {
      this.page.data = response;

      if (this.page.data.result != 'pass'){
        this.page.loading = false;
        hideWait();
      } else {
        this.getCustomers(this.acno);
      }
    });
  }

  newCustomer() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/newcustomer/' + this.page.rfno]);
  }

  dsppbdate(date:any){
      return formatDateUS(new Date(convertToDate(date)));
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getCustomers(this.acno)
  }

  onPageChange(event: number) {
    this.p = event
    this.getCustomers(this.acno)
  }
}
