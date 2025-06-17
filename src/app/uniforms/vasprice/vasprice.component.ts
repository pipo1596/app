import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-vasprice',
  standalone: false,
  templateUrl: './vasprice.component.html',
  styleUrl: './vasprice.component.css'
})
export class VaspriceComponent {
  page = new Page();
  drop = false;
  price: any;
  pricings = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.loadVAS('getInfo')
  }

  searchConfig(){
    var config ={
      displayKey: "desc",
      placeholder: 'Select',
      limitTo: 10,
      noResultsFound: 'No results found',
    }
    return config
  }

    loadVAS(mode: any){
    let data = {
      mode: mode,
      nhno: this.page.rfno,
      price: (mode !== 'getInfo') ? this.price.price : '' 
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNHPR', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.pricing) this.pricings = this.page.data.pricing
      if (this.page.data?.info) this.price = this.page.data.info

      this.page.loading = false;
      hideWait();
    });

  }

}
