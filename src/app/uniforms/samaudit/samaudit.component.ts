import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { convertToDate, formatDateUS, hideWait, showWait } from '../../shared/utils';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-samaudit',
  standalone: false,
  templateUrl: './samaudit.component.html',
  styleUrl: './samaudit.component.css'
})
export class SamauditComponent {
  page = new Page();
  drop = false;

  //Search
  ccnm: any = "";
  ccns: any = "";
  ccnc: any = "";
  srch = "";

  //Paging
  p: number = 1;
  itemsPerPage: number = 10;
  total: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    public layout: LayoutService
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      if(params.get('rfno')){
        this.ccnm = params.get('rfno')?.slice(0,10)
        this.ccnc = params.get('rfno')?.slice(10,20)
        this.ccns = params.get('rfno')?.slice(20,30)
      }
    });
    this.getAudits();
  }

  getAudits() {
    showWait();
    let data = {
      nhno: this.page.rfno,
      ccnm: this.ccnm,
      ccnc: this.ccnc,
      ccns: this.ccns,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }
    
    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNCL', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.pgName) this.layout.setProgram(this.page.rfno, this.page.data.pgName);
      if (this.page.data?.title) this.layout.setTitle(this.page.data.title)
      if (this.page.data?.menu) this.layout.setMenu(this.page.data.menu)
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.total) this.total = this.page.data.total;
      this.page.loading = false;
      hideWait();
    });
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getAudits();
  }

  onPageChange(event: number) {
    this.p = event
    this.getAudits();
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/samtrack/' + this.page.rfno]);
  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  dsppbdate(date:any){
    if (!date) return '';
    return formatDateUS(new Date(convertToDate(date)));
  }
}
