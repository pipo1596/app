import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-warehouse',
  standalone: false,
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.css'
})
export class WarehouseComponent {
  page = new Page();
  drop = false;
  whno: any = "";
  warehouses: any = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.loadWarehouse('getInfo')
  }

  loadWarehouse(mode: any){
    showWait();
    let data = {
      mode: mode,
      nhno: this.page.rfno,
      whno: (mode !== 'getInfo') ? this.whno : '' 
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRWH', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.warehouses) this.warehouses = this.page.data.warehouses;
      if (this.page.data?.info?.whno) this.whno = this.page.data.info.whno;
      this.page.loading = false;
      hideWait();
    });
  }

  goCategories(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/categories/' + this.page.rfno]);
  }

}
