import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  page = new Page();
  drop = false; // More Actions

  // Parms
  nhno:any
  nano:any

  //Input
  name = "";
  pnan: any; 
  upct = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { hideWait(); }

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.setMode();

    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      nano: this.nano
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNA', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;

      if (this.router.url.indexOf('/uniforms/copycategory') >= 0){
        this.name = 'Copy of ' + this.page.data?.info?.desc;
      } else { this.name = this.page.data?.info?.desc; }

      if(this.page.data?.info?.pnan){
        let parent = {
          nano: this.page.data.info.pnan,
          desc: this.page.data.info.pdesc
        }
        this.pnan = parent
      }

      hideWait();
      this.page.loading = false;
    });
  }

  setMode() {
    if (this.router.url.indexOf('/uniforms/editcategory') >= 0) {
      this.page.editmode = true;
      this.page.entrymode = false;
    } else {
      this.page.editmode = false;
      this.page.entrymode = true;
    }

    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.nano = params.get('nano')
    });
    localStorage.clear();
  }

  searchConfig(){
    var config ={
      displayFn:(item: any) => { return item.desc; },
      displayKey: 'desc',
      search: true,
      placeholder: 'Select',
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: 'desc'
    }
    return config
  }

  loadCategory(mode: string){
      showWait();
      console.log(this.pnan);
  
      let data = {
        mode: mode,
        nhno: this.nhno,
        nano: this.nano,
        pnan: this.pnan.nano,
        desc: this.name,
        upct: (mode == 'update') ? this.upct : ''
      }
  
      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNA', data).subscribe(response => {
        this.page.data = response;
        if(this.page.data?.upct) this.upct = this.page.data.upct;
  
        if (mode !== 'update') {
          if (this.page.data.result == 'pass' && this.page.data.nhno){
            localStorage.setItem('UP_AUTH','Y');
            this.router.navigate(['/uniforms/categories/' + this.page.data.nhno]);
          }
        }
        this.page.loading = false;
        hideWait();
      });
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/categories/' + this.nhno]);
  }

}
