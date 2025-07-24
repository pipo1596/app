import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-vas-application',
  standalone: false,
  templateUrl: './vas-application.component.html',
  styleUrl: './vas-application.component.css'
})

export class VasApplicationComponent {
  page = new Page();
  drop = false; // More Actions
  copy: any;

  // Parms
  nhno: any;
  npno: any;
  n1no: any;
  upct = "0";

  // Input
  styl: any;
  desc: any;
  effd = "";
  expd = "";
  seq = "";


  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { hideWait(); }

  ngOnInit(): void {
    localStorage.clear();
    hideWait();
    this.setMode();

    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      npno: this.npno,
      styl: this.styl
    }

    // this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
    //   this.page.data = response;
    //   if (this.page.data?.menu) this.page.menu = this.page.data.menu;

    //   if (this.copy){
    //     this.desc = 'Copy of ' + this.page.data?.info?.desc;
    //   } else { this.desc = this.page.data?.info?.desc; }

    //   if (this.page.data?.info?.styl) this.styl = this.page.data.info.styl
    //   if(this.page.data?.info?.effd) this.effd = this.page.data.info.effd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    //   if(this.page.data?.info?.expd) this.expd = this.page.data.info.expd.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
    // });

    this.page.loading = false;
    hideWait();
  }

  inqStyle() {
    localStorage.clear();
    if(this.page.editmode){
      localStorage.setItem('styl', this.styl)
      localStorage.setItem('partpg','/uniforms/editproduct/' + this.nhno + '/' + this.n1no + '/')
    } else {
      localStorage.setItem('partpg','/uniforms/newproduct/' + this.nhno + '/')
    }
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/style/' + this.nhno]);
  }

  searchConfig(){
    var config ={
      displayKey: 'desc',
      search: true,
      placeholder: 'Select',
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: 'desc'
    }
    return config
  }

  setMode() {
    this.copy = localStorage.getItem('copy')

    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.npno = params.get('npno')
      this.n1no = params.get('n1no')
    });

    if (this.n1no && !this.copy) {
      this.page.editmode = true;
      this.page.entrymode = false;
    } else { 
      this.page.entrymode = true;
      this.page.editmode = false;
    }
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/vasapplications/' + this.nhno + '/' + this.npno]);
  }

  loadProduct(mode: string){
  //   showWait();

  //   let data = {
  //     mode: mode,
  //     nhno: this.nhno,
  //     nino: this.nino,
  //     styl: this.styl,
  //     options: this.opv,
  //     whno: this.warehouse,
  //     vfgn: this.custs,

  //     upct: (mode == 'update') ? this.upct : ''
  //   }

  //   this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
  //     this.page.data = response;
  //     if(this.page.data?.upct) this.upct = this.page.data.upct;

  //     if (mode !== 'update') {
  //       if (this.page.data.result == 'pass' && this.page.data.nhno){
  //         this.router.navigate(['/uniforms/products/' + this.page.data.nhno]);
  //       }
  //     }
  //     this.page.loading = false;
  //     hideWait();
  //   });
  }
}
