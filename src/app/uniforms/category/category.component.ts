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
  copy: any;
  partpg: any;
  cache: any;
  styl: any;

  // Parms
  nhno:any
  nano:any

  //Input
  name = "";
  pnan: any = ""; 
  upct: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.setMode();
    showWait();

    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      nano: this.nano
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNA', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.info?.upct) this.upct = this.page.data?.info?.upct

      if (this.copy){
        this.name = 'Copy of ' + this.page.data?.info?.desc;
      } else { this.name = this.page.data?.info?.desc; }

      if(this.page.data?.info?.pnan){
        let naparent = {
          nano: this.page.data.info.pnan,
          desc: this.page.data.info.pdesc
        }
        this.pnan = naparent
      }

      if(this.page.data?.categories){
        this.page.data.categories = this.page.data.categories.sort((a: any,b: any) => a.nano.localeCompare(b.nano))
      }

      localStorage.clear();
      hideWait();
      this.page.loading = false;
    });
  }

  setMode() {
    this.copy = localStorage.getItem('copy');
    this.partpg = localStorage.getItem('partpg');
    this.cache = localStorage.getItem('cache');
    this.styl = localStorage.getItem('styl');

    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.nano = params.get('nano')
    });

    if (this.nano && !this.copy) {
      this.page.editmode = true;
      this.page.entrymode = false;
    } else {
      this.page.editmode = false;
      this.page.entrymode = true;
    }
  }

  searchConfig(){
    var config ={
      displayFn:(item: any) => { 
        let cat = ""
        if(item.desc3) cat = item.desc3 + ' > '
        if(item.desc2) cat = cat + item.desc2 + ' > '
        if(item.desc) cat = cat + item.desc
        return cat
      },
      displayKey: 'desc',
      search: true,
      placeholder: 'Select',
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: 'desc',
      customComparator: (i1: any,i2: any) => {
        let ret = i1[config.displayKey] < i2[config.displayKey];
        return ret? -1: 1;
      }
    }
    return config
  }

  loadCategory(mode: string){
      showWait();
  
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
  
        if (this.page.data.result == 'pass' && this.page.data.nhno){
          localStorage.setItem('UP_AUTH','Y');
          localStorage.setItem('styl', this.styl);
          localStorage.setItem('cache', this.cache);

          let cat = {
            nano: this.page.data?.nano,
            desc: this.page.data?.desc
          }
          localStorage.setItem('nano', JSON.stringify(cat));

          if(this.partpg) {
            this.router.navigate([this.partpg]);
          } else this.router.navigate(['/uniforms/categories/' + this.page.data.nhno]);
          
        }
        
        this.page.loading = false;
        hideWait();
      });
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    if(this.partpg) {
      localStorage.setItem('styl',this.styl);
      this.router.navigate([this.partpg]);
    } else this.router.navigate(['/uniforms/categories/' + this.nhno]);
  }

}
