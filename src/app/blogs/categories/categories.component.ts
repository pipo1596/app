import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseliveurl, convertToTimestamp, hideWait, openModal, scrollToTopInstant, showToast, showWait, sortByKey, timeAgo } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { Page } from '../../shared/textField';


@Component({
  selector: 'app-categories',
  standalone: false,

  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  @Input() child: boolean | undefined;
  @Input() bcnp: string | undefined;
  search = "";
  pvsearch = "";
  showList = false;

  imgprfx = environment.imgprfx;

  page = new Page();

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {

    let data = {
      mode: 'SEARCH',
      site: this.getSite(),
      bcnp: this.child ? this.bcnp : ""
    }

    this.http.post(environment.apiurl + '/cgi/APPLMBCATG', data).subscribe(response => {

      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      this.page.loading = false;
      scrollToTopInstant();
      hideWait();
    });
  }

  encodedurl(url: string) {
    return encodeURI(url);
  }

  setSite(site: string) {
    localStorage.setItem('site', site);
    this.showList = false;
    this.Search(true);
  }
  getSite() {
    return localStorage.getItem('site');
  }

  hideDrop() {
    setTimeout(() => {
      this.showList = false
    }, 300);

  }

  StartEntry() {
    this.router.navigate(['/blogs/newcategory']);
  }
  ViewCategory(category: any) {
    showWait();
     
     let data = {
      mode: 'URL',
      bcno:category.bcno
    }
    this.http.post(environment.apiurl + '/cgi/APPLMBCATG', data).subscribe(response => {

      let url:any = response;
      hideWait();
      setTimeout(() => {      
      if(url?.url.length>2)
        window.open(baseliveurl()+url.url.trim()+'?pmpreview=Y');
      else
        window.open(baseliveurl()+category.url.trim()+'?pmpreview=Y');
      }, 50);
    });

  }
  EditCategory(category: string) {
    this.router.navigate(['/blogs/editcategory/' + category]);
  }
  startDelete(category: string) {
    this.page.rfno = category;
    openModal('deleteCategories');

  }

  lastUpdate(category: any) {
    let lastdate = "0";
    let lasttime = "0";
    if (category.addt !== "0") {
      lastdate = category.addt;
      lasttime = category.adtm;

    }
    if (category.lsdt !== "0") {
      lastdate = category.lsdt;
      lasttime = category.lstm;
    }
    if (lastdate !== "0")
      return timeAgo(convertToTimestamp(lastdate, lasttime));
    else
      return "";
  }
  CancelEntry() {
    showWait();
    hideWait();
  }
  Search(force?: boolean) {
    force = force ?? false;
    if (!force && this.search == this.pvsearch) return;

    showWait();

    let data = {
      mode: 'SEARCH',
      site: this.getSite(),
      bcnp: this.child ? this.bcnp : "",
      search: this.search
    }
    this.pvsearch = this.search;
    this.http.post(environment.apiurl + '/cgi/APPLMBCATG', data).subscribe(response => {
      this.page.data = response;
      scrollToTopInstant();
      hideWait();
    });
  }

  newBlog() {
    this.router.navigate(['/blogs/newblog/' + this.page.rfno]);
  }
  SearchBlogs() {
    this.router.navigate(['/blogs/blogslist']);
  }


  getParent(index: number) {
    this.page.data.categories[index].expand = !this.page.data.categories[index].expand;
    if (!this.page.data || !this.page.data.categories || this.page.data.categories.length < 1) return;
    if (this.page.data.categories[index].parents?.length > 0) return;

    let data = {
      mode: 'PATH',
      bcno: this.page.data.categories[index].bcno
    }
    this.http.post(environment.apiurl + '/cgi/APPLMBCATG', data).subscribe(response => {

      this.page.data.categories[index].parents = sortByKey(response, 'bcno', 'A');
    });
  }
  onDelete() {

    let data = {
      mode: 'DELETE',
      bcno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPLMBCATG', data).subscribe(response => {
      showToast();

      this.Search(true);
    });
  }

}
