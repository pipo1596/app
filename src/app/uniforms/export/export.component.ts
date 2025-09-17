import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { showWait, hideWait, convertToDate, formatDateUS } from '../../shared/utils';

@Component({
  selector: 'app-export',
  standalone: false,
  templateUrl: './export.component.html',
  styleUrl: './export.component.css'
})
export class ExportComponent {
  page = new Page();

  //Paging
  p: number = 1;
  itemsPerPage: number = 12;
  total: number = 0;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getReports();
  }

  getReports(){
    showWait();
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMRP', data).subscribe(response => {
      hideWait();
      this.page.loading = false;
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.total) this.total = this.page.data.total
    });
  }

  openReport(rpno: any){
    localStorage.setItem('UP_AUTH','Y')
    this.router.navigate(['/uniforms/' + rpno + '/' + this.page.rfno]); 
  }

  downloadReport(rpno: any){ 
    return environment.apiurl + '/cgi/CGWHSRRV?PMRPNO=' + rpno 
  }

  loadReport(rpno: any, action: any, flag: any){
    switch(action){
      case 'delete':{
        let data = {
          mode: action,
          rpno: rpno
        }
        this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMRP', data).subscribe(response => {
          this.page.data = response;
          if (this.page.data?.title) this.page.title = this.page.data.title;
          if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
          if (this.page.data?.menu) this.page.menu = this.page.data.menu;
        });
        this.getReports();
        break;
      }
      case 'update':{
        let data = {
          mode: action,
          rpno: rpno,
          keep: flag
        }
        this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMRP', data).subscribe(response => {
          this.getReports();
        });
        break;
      }
    }
  }

  dsppbdate(date:any){
    if (date !== '0'){ return formatDateUS(new Date(convertToDate(date))); } else return '';
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getReports()
  }

  onPageChange(event: number) {
    this.p = event
    this.getReports()
  }

}
