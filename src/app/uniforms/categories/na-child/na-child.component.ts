import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Page } from '../../../shared/textField';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { hideWait, showWait } from '../../../shared/utils';

@Component({
  selector: 'app-na-child',
  standalone: false,
  templateUrl: './na-child.component.html',
  styleUrl: './na-child.component.css'
})
export class NaChildComponent {
  @Input() nhno : any = "";
  @Input() category : any = "";
  @Input() expanded : any = [];
  @Input() rtpg: any;

  page = new Page();

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private router: Router
  ){}

  ngOnInit(): void {
    showWait();
    let data = {
      mode: 'SEARCH',
      nhno: this.nhno,
      nano: this.category.nano,
      srch: '',
      itemsPerPage: 10,
      currentPage: 1
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNA', data).subscribe(response => {
      this.page.data = response;
      hideWait();
    });
  }

  ngAfterContentChecked(): void {
   this.cdr.detectChanges();
  }  

  loadCategory(mode: any, nano: any){
    switch(mode){
      case 'new':
        this.router.navigate(['/uniforms/category/' + this.nhno]);
        break;
      case 'edit':
        this.router.navigate(['/uniforms/category/' + this.nhno + '/' + nano]);
        break;
      case 'copy':
        localStorage.setItem('copy', nano)
        this.router.navigate(['/uniforms/category/' + this.nhno + '/' + nano]);
        break;
    }
  }

  deleteCategory(nano: string){
    
    let data = {
      mode: 'delete',
      nhno: this.nhno,
      nano: nano
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNA', data).subscribe(response => {
      this.page.data = response;

      if (this.page.data.result != 'pass'){
        this.page.loading = false;
        hideWait();
      } else {
        this.getCategories();
      }
    });
  }

  expandCategory(category: any) {
    if(this.expanded.includes(category)){
      this.expanded.splice(this.expanded.indexOf(category),1)
    } else{
      this.expanded.push(category)
    }
  }

  getCategories() {
    let data = {
      mode: 'SEARCH',
      nhno: this.nhno,
      srch: '',
      itemsPerPage: 10,
      currentPage: 1
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNA', data).subscribe(response => {
      this.rtpg.data = response;
      this.rtpg.loading = false;
      hideWait();
    });
  }

}
