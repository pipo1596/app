import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-overrides',
  standalone: false,
  templateUrl: './overrides.component.html',
  styleUrl: './overrides.component.css'
})
export class OverridesComponent {
  page = new Page();
  drop = false;
  errors: any;

  //Parms
  nino: any;

  //Input
  opv1: any = "";
  opv2: any = "";
  opv3: any = "";
  opv4: any = "";
  opv5: any = "";

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
      this.nino = params.get('nino');
    });
    this.getOverrides();
  }

  getOverrides() {
    showWait();
      let data = {
        mode: 'getInfo',
        nhno: this.page.rfno,
        nino: this.nino,
        itemsPerPage: this.itemsPerPage,
        currentPage: this.p
      }
      
      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMIW', data).subscribe(response => {
        this.page.data = response;
        if (this.page.data.title) this.page.title = this.page.data.title;
        if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
        if (this.page.data.menu) this.page.menu = this.page.data.menu;
        if (this.page.data.total) this.total = this.page.data.total;
        this.page.loading = false;
        hideWait();
      });
  }

  addOverride(){
    showWait();
    this.errors = "";
      let data = {
        mode: 'add',
        nhno: this.page.rfno,
        nino: this.nino,
        opv1: this.opv1,
        opv2: this.opv2,
        opv3: this.opv3,
        opv4: this.opv4,
        opv5: this.opv5
      }

      let temp = new Page();
      
      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMIW', data).subscribe(response => {
        temp.data = response;

        if (temp.data.result !== 'pass'){
          this.errors = temp.data.errors;
          this.page.loading = false;
          hideWait();
        } else {
          this.opv1 = "";
          this.opv2 = "";
          this.opv3 = "";
          this.opv4 = "";
          this.opv5 = "";
          this.getOverrides();
        }
      });
  }

  editOverride(override: any){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(
      ['/uniforms/override/' + this.page.rfno + '/' + this.nino],
      { queryParams: { opv1: override.opv1, opv2: override.opv2, opv3: override.opv3, opv4: override.opv4, opv5: override.opv5 } }
    );
  }

  deleteOverride(override: any){
    this.errors = "";
      let data = {
        mode: 'delete',
        nhno: this.page.rfno,
        nino: this.nino,
        opv1: override.opv1,
        opv2: override.opv2,
        opv3: override.opv3,
        opv4: override.opv4,
        opv5: override.opv5
      }

      let temp = new Page();
      
      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMIW', data).subscribe(response => {
        temp.data = response;

        if (temp.data.result !== 'pass'){
          this.errors = temp.data.errors;
          this.page.loading = false;
          hideWait();
        } else {
          this.getOverrides();
        }
      });
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getOverrides();
  }

  onPageChange(event: number) {
    this.p = event
    this.getOverrides();
  }

  goBack(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/product/' + this.page.rfno + '/' + this.nino]);
  }
}
