import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-samgroup',
  standalone: false,
  templateUrl: './samgroup.component.html',
  styleUrl: './samgroup.component.css'
})
export class SamgroupComponent {
  page = new Page();
  drop = false;
  whno: any = "";
  ccnm: any = "";
  ccnc: any = "";
  ccns: any = "";
  sam: any = "";

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
      this.ccnm = params.get('rfno')?.substring(0,10)
      this.ccnc = params.get('rfno')?.substring(10,20)
      this.ccns = params.get('rfno')?.substring(20,30)
    });
    this.loadGroup('getInfo')
  }

  loadGroup(mode: any){
    showWait();
    let samI = this.page.data?.info?.sam
    let data = {
      mode: mode,
      nhno: this.page.rfno,
      ccnm: this.ccnm,
      ccnc: this.ccnc,
      ccns: this.ccns,
      sam: this.sam
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNCC', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.pgName) this.layout.setProgram(this.page.rfno, this.page.data.pgName);
      if (this.page.data?.title) this.layout.setTitle(this.page.data.title)
      if (this.page.data?.menu) this.layout.setMenu(this.page.data.menu)
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data?.info?.sam) this.sam = this.page.data.info.sam;
      if(this.page.data?.errors) this.sam = samI
      this.page.loading = false;
      hideWait();
    });
  }

  goCategories(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/categories/' + this.page.rfno]);
  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/samtrack/' + this.page.rfno]);
  }

}
