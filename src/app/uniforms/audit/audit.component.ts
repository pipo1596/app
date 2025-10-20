import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait, convertToDate, formatDateUS, dbtodsptime} from '../../shared/utils';

@Component({
  selector: 'app-audit',
  standalone: false,
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.css'
})
export class AuditComponent {
  page = new Page();
  drop = false;
  errors: any;

  //Search
  frdt: any;
  todt: any;
  npno: any = "";
  nano: any = "";
  styl: any;

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
    hideWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getAudits();
  }

  getAudits() {
    showWait();
    this.errors = ""
    if(this.frdt || this.todt) this.chkFltr();

    if(this.errors){
      this.page.loading = false;
      hideWait();
    } else {
      let data = {
        nhno: this.page.rfno,
        frdt: this.frdt?.replaceAll('-',''),
        todt: this.todt?.replaceAll('-',''),
        npno: this.npno,
        nano: this.nano,
        styl: this.styl,
        itemsPerPage: this.itemsPerPage,
        currentPage: this.p
      }
      
      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNLH', data).subscribe(response => {
        this.page.data = response;
        if (this.page.data.title) this.page.title = this.page.data.title;
        if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
        if (this.page.data.menu) this.page.menu = this.page.data.menu;
        if (this.page.data.total) this.total = this.page.data.total;
        this.page.loading = false;
        hideWait();
      });
    }
  }

  chkFltr(){
    let frdt = parseInt(this.frdt?.replaceAll('-',''))
    let todt = parseInt(this.todt?.replaceAll('-',''))
    if(frdt > todt) this.errors = 'End Date has to be Greater than Start Date'
  }

  getInt(value: any){
    return parseInt(value);
  }

  dsppbdate(date:any){
      return formatDateUS(new Date(convertToDate(date)));
  }

  dsppbtime(time:any){
    const hours = time.length === 4 ? time.substring(0, 2) : time.substring(0, 1); // Handling for 3-digit times (e.g. 610)
    const minutes = time.length === 4 ? time.substring(2, 4) : time.substring(1, 3); // Handling for 3-digit times
    const seconds = time.length === 6 ? time.substring(4, 6) : time.substring(3, 5); // Handling for 3-digit times
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2,'0')}` 
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getAudits();
  }

  onPageChange(event: number) {
    this.p = event
    this.getAudits();
  }
}
