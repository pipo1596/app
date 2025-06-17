import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-uplist',
  standalone: false,
  templateUrl: './uplist.component.html',
  styleUrl: './uplist.component.css'
})
export class UplistComponent {
  page = new Page();
  drop = false;
  plno: any;
  desc: any;
  upct: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.plno = params.get('plno');
    });
    this.loadList('getInfo')
  }

  inqList(){
    localStorage.clear();
    localStorage.setItem('partpg','/uniforms/uplist/' + this.page.rfno + '/')
    this.router.navigate(['/uniforms/pricelist/' + this.page.rfno]);
  }

  loadList(mode: any){
    let data = {
      mode: mode,
      nhno: this.page.rfno,
      plno: this.plno,
      upct: (mode == 'update') ? this.upct : ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRPL', data).subscribe(response => {
      this.page.data = response;
      if(this.page?.data?.menu) this.page.menu = 'Y';
      if(this.page?.data?.info.plno) this.plno = this.page.data.info.plno;
      if(this.page?.data?.info.desc) this.desc = this.page.data.info.desc;
      if(this.page?.data?.info.upct) this.upct = this.page.data.info.upct;
      this.page.loading = false;
      hideWait();
    });
  }
}
