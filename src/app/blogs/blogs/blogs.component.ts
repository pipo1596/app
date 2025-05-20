import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { baseliveurl, convertToDate, convertToTimestamp, formatDateUS, hideWait, openModal, scrollToTopInstant, showToast, showWait, sortByKey, timeAgo } from '../../shared/utils';

@Component({
  selector: 'app-blogs',
  standalone: false,

  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.css'
})
export class BlogsComponent {
  @Input() child: boolean | undefined;
  @Input() bcnp: string | undefined;
  @Output() triggerEvent = new EventEmitter<string>();
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
      if(this.child)this.triggerEvent.emit('Y');
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
  ViewBLog(blog: any) {
    showWait();
    let data = {
          mode: 'URL',
          bpno:blog.bpno
        }
        this.http.post(environment.apiurl + '/cgi/APPLMBLOG', data).subscribe(response => {
          let url:any = response;
          hideWait();
          setTimeout(() => {           
          
          if(url?.url.length>2)
            window.open(baseliveurl()+url.url.trim()+'?pmpreview=Y');
          else
            window.open(baseliveurl()+'/'+blog.url.trim()+'?pmpreview=Y');
          }, 50);
        });
    
  }
  dsppbdate(blog:any){
    let pbdt = new Date(convertToDate(blog.pbdt));
    let tody = new Date();
    if(tody<=pbdt){
      return ' - on '+formatDateUS(pbdt);
    }else{
      return '';
    }

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

  breadcrumbs(bcno:string,site:any):string {
        // Create category map with string-based bcno
        const categoryMap = new Map<string, any>(this.page.data.categories.map((cat: { bcno: any; }) => [cat.bcno, cat]));
        let suffix = 'blog';
        if(site=='K')suffix = 'blog';
        // Initialize path and find starting category
        let path: string[] = [];
        let current = categoryMap.get(bcno);
    
        // Check if category exists for the given bcno
        if (!current) {
            return suffix; // Return default if category not found
        }
    
        // Traverse up the hierarchy, adding URLs to the path
        while (current) {
            path.unshift(current.desc.toLowerCase());  // Add category description (or any other URL part) to path
            current = categoryMap.get(current.bcnp);  // Move to parent category
        }
    
        // Return the constructed URL or fallback to base path
        return suffix + (path.length > 0 ? ' > ' + path.join(' > ') : '');
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
