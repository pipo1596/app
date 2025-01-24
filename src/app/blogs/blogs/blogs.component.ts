import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { convertToTimestamp, hideWait, openModal, scrollToTopInstant, showToast, showWait, sortByKey, timeAgo } from '../../shared/utils';

@Component({
  selector: 'app-blogs',
  standalone: false,

  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
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

    this.http.post(environment.apiurl + '/cgi/APPLMBLOG', data).subscribe(response => {

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
  ViewBLog(blogid: string) {
    this.router.navigate(['/blogs/viewcblog/' + blogid]);
  }
  EditBlog(blogid: string) {
    this.router.navigate(['/blogs/editblog/' + blogid]);
  }
  startDelete(blogid: string) {
    this.page.rfno = blogid;
    openModal('deleteBlog');

  }

  lastUpdate(blog: any) {
    let lastdate = "0";
    let lasttime = "0";
    if (blog.addt !== "0") {
      lastdate = blog.addt;
      lasttime = blog.adtm;

    }
    if (blog.lsdt !== "0") {
      lastdate = blog.lsdt;
      lasttime = blog.lstm;
    }
    if (lastdate !== "0")
      return timeAgo(convertToTimestamp(lastdate, lasttime));
    else
      return "";
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
    this.http.post(environment.apiurl + '/cgi/APPLMBLOG', data).subscribe(response => {
      this.page.data = response;
      scrollToTopInstant();
      hideWait();
    });
  }

  newBlog() {
    this.router.navigate(['/blogs/newblog/' + this.page.rfno]);
  }
  SearchCategs() {
    this.router.navigate(['/blogs/categories']);
  }


  onDelete() {

    let data = {
      mode: 'DELETE',
      bpno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPLMBLOG', data).subscribe(response => {
      showToast();

      this.Search(true);
    });
  }

}
