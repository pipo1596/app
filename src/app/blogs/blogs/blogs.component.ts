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
    @Input() child : boolean | undefined;
    @Input() bcnp : string | undefined;
    search="";
    pvsearch="";
    showList=false;
  
    imgprfx = environment.imgprfx;
  
    page = new Page();
  
    constructor(private http: HttpClient,
                private router: Router
    ) {}
  
    ngOnInit(): void {
  
      let data = {
        mode: 'SEARCH',
        site: this.getSite(),
        bcnp: this.child?this.bcnp:""
      }
      
      this.http.post(environment.apiurl+'/cgi/APPLMBLOG',data).subscribe(response => {
  
        this.page.data = response;
        if(this.page.data.title) this.page.title = this.page.data.title;
        if(this.page.data.fullname) this.page.fullname = this.page.data.fullname;
        this.page.loading =false;
        scrollToTopInstant();
        hideWait();
      });
    }
  
    encodedurl(url:string){
     return encodeURI(url);
    }
  
    setSite(site:string){
      localStorage.setItem('site', site);
      this.showList=false;
      this.Search(true);
    }
    getSite(){
      return localStorage.getItem('site');
    }
  
    hideDrop(){
      setTimeout(() => {
        this.showList=false
      }, 300);
      
    }
  
    StartEntry(){
      this.router.navigate(['/blogs/newcategory']);
    }
    ViewCategory(category:string){
      this.router.navigate(['/blogs/viewcategory/'+category]);
    }
    EditCategory(category:string){
      this.router.navigate(['/blogs/editcategory/'+category]);
    }
    startDelete(category:string){
      this.page.rfno = category;
      openModal('deleteCategory');
  
    }
  
    lastUpdate(category:any){
      let lastdate = "0";
      let lasttime = "0";
      if(category.addt !== "0"){
        lastdate = category.addt;
        lasttime = category.adtm;
  
      }
      if(category.lsdt !== "0"){
        lastdate = category.lsdt;
        lasttime = category.lstm;
      }
      if(lastdate !=="0")
        return timeAgo(convertToTimestamp(lastdate,lasttime));
      else
        return "";
    }
    CancelEntry(){
      showWait();
      hideWait();
    }
    Search(force?:boolean){  
      force = force ?? false;
      if(!force && this.search == this.pvsearch) return;
  
      showWait();
  
      let data = {
        mode: 'SEARCH',
        site: this.getSite(),
        bcnp: this.child?this.bcnp:"",
        search: this.search    
      }
      this.pvsearch = this.search;
      this.http.post(environment.apiurl+'/cgi/APPLMBLOG',data).subscribe(response => {
        this.page.data = response; 
        scrollToTopInstant();
        hideWait();
      });
    }
  
    newBlog(){
      this.router.navigate(['/blogs/newblog/'+this.page.rfno]);
    }
  
    getParent(index:number){
      this.page.data.blogs[index].expand = !this.page.data.blogs[index].expand;
      if(!this.page.data || !this.page.data.blogs || this.page.data.blogs.length<1)return;
      if(this.page.data.blogs[index].parents?.length>0) return;
  
      let data = {
        mode: 'PATH',
        bcno: this.page.data.blogs[index].bcno    
      }
      this.http.post(environment.apiurl+'/cgi/APPLMBLOG',data).subscribe(response => {
        
        this.page.data.blogs[index].parents = sortByKey(response,'bcno','A');
      });
    }
    onDelete() {
       
       let data = {
        mode: 'DELETE',
        bcno: this.page.rfno    
      }
      
      this.http.post(environment.apiurl+'/cgi/APPLMBLOG',data).subscribe(response => {
        showToast();
        
        this.Search(true);
      });
      }

}
