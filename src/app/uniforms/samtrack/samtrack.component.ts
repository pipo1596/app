import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { convertToDate, formatDateUS, hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-samtrack',
  standalone: false,
  templateUrl: './samtrack.component.html',
  styleUrl: './samtrack.component.css'
})
export class SamtrackComponent {
  exp: any;
  page = new Page();
  drop = false;

  //Search
  srch = "";

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
    if(localStorage.getItem('expanded')){
      this.exp = localStorage.getItem('expanded')
    }
    localStorage.clear();
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getGroups(this.srch);
  }

  getGroups(grp: string) {
    this.srch = grp
    showWait();
    let data = {
      nhno: this.page.rfno,
      srch: this.srch,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }
    
    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNCC', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.total) this.total = this.page.data.total;
      this.page.loading = false;
      hideWait();
    });
  }

  editGroup(rfno: string) {
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('expanded',this.exp)
    this.router.navigate(['/uniforms/samgroup/' + this.page.rfno + '/' + rfno]);
  }

  deleteGroup(rfno: string) {
    showWait();
    
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      nono: rfno,
      note: '',
      upct: ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNO', data).subscribe(response => {
      this.page.data = response;
    
      if (this.page.data.result !== 'pass'){
        this.page.loading = false;
        hideWait();
      } else {
        this.getGroups(this.srch);
      }
    });
  }

  newNote() {
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('expanded',this.exp)
    this.router.navigate(['/uniforms/samgrp/' + this.page.rfno]);
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getGroups(this.srch);
  }

  onPageChange(event: number) {
    this.p = event
    this.getGroups(this.srch);
  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  dsppbdate(date:any){
    if (!date) return '';
    return formatDateUS(new Date(convertToDate(date)));
  }
}
