import { Component, ChangeDetectorRef} from '@angular/core';
import { environment } from '../../../environments/environment';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { scrollToTopInstant, hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})

export class CategoriesComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  page = new Page();
  drop = false;

  //Search 
  srch = "";
  expanded: any[] = [];

  //Paging
  p: number = 1;
  itemsPerPage: number = 10;
  total: number = 0;

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getCategories();
  }

  ngAfterContentChecked(): void {
   this.cdr.detectChanges();
  }  

  getCategories() {
    showWait();
    let data = {
      mode: 'SEARCH',
      nhno: this.page.rfno,
      srch: this.srch,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNA', data).subscribe(response => {

      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.total) this.total = this.page.data.total
      hideWait();
      this.page.loading = false;
      scrollToTopInstant();
    });
  }

  expandCategory(category: any, isParent: boolean){
    if(this.expanded.includes(category)){
      this.expanded.splice(this.expanded.indexOf(category),this.expanded.length)
    } else{
      if(isParent){ this.expanded = [] }
      this.expanded.push(category)
    }
  }

  loadCategory(mode: any, nano: any){
    localStorage.setItem('UP_AUTH','Y')
    switch(mode){
      case 'new':
        this.router.navigate(['/uniforms/category/' + this.page.rfno]);
        break;
      case 'edit':
        this.router.navigate(['/uniforms/category/' + this.page.rfno + '/' + nano]);
        break;
      case 'copy':
        localStorage.setItem('copy',nano)
        this.router.navigate(['/uniforms/category/' + this.page.rfno + '/' + nano]);
        break;
    }
  }

  deleteCategory(nano: string){
    showWait();
    
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      nano: nano
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNA', data).subscribe(response => {
      this.page.data = response;

      if (this.page.data?.result != 'pass'){
        hideWait();
        this.page.loading = false;
      } else {
        location.reload();
        // this.getCategories();
      }
    });
  }

  goProducts(category: any){
    let cat = {
      nano: category.nano,
      desc: category.desc
    }
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('nano',JSON.stringify(cat));
    this.router.navigate(['/uniforms/products/' + this.page.rfno]);
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getCategories()
    this.expanded = []
  }

  onPageChange(event: number) {
    this.p = event
    this.getCategories() 
    this.expanded = []
  }

  }
