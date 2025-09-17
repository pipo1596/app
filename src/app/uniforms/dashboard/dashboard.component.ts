import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { convertToDate, formatDateUS, hideWait } from '../../shared/utils';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  page = new Page();
  imgprfx = environment.logoprfx;
  upNum: any = "";

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    hideWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.upNum = this.page.rfno?.replace(/^0+/, '');
    });

    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNH', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.info.effd) this.page.data.info.effd = this.page.data.info.effd;
      if (this.page.data.info.expd) this.page.data.info.expd = this.page.data.info.expd;
    });
  }

  loadProduct (menu: any) {
    localStorage.setItem('UP_AUTH','Y')
    switch(menu){
      case 'addProduct':
        this.router.navigate(['uniforms/newproduct/' + this.page.rfno]);
        break;
      case 'importProduct':
        this.router.navigate(['/uniforms/OEUL36/' + this.page.rfno + '/OEUL36']);
        break;
      case 'createCategory':
        this.router.navigate(['/uniforms/category/' + this.page.rfno]);
        break;
      case 'cxmlConfig':
        this.router.navigate(['/uniforms/cxmlconfigs/' + this.page.rfno]);
        break;
      case 'bldCustomization':
        this.router.navigate(['/uniforms/newcustomization/' + this.page.rfno]);
        break;
    }
  }

  loadWarehouse(){
    localStorage.setItem('UP_AUTH','Y')
    this.router.navigate(['/uniforms/warehouse/' + this.page.rfno]);
  }

  loadPricing(menu: any){
    localStorage.setItem('UP_AUTH','Y')
    switch(menu){
      case 'addList':
        this.router.navigate(['/uniforms/uplist/' + this.page.rfno]);
        break;
      case 'addPricing':
        this.router.navigate(['/uniforms/vasprice/' + this.page.rfno]);
        break;
    }
  }

    dsppbdate(date:any){
      return formatDateUS(new Date(convertToDate(date)));
    }
}
