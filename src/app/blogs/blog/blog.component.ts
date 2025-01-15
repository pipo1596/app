import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-blog',
  standalone: false,
  
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  //This contains all the share page data:
  page = new Page();
  showUpload:boolean = false;
  //Screen Fields
  blogTitle  = new TextField("blogtitle",["required"]);
  blogHtml  = new TextField("bloghtml",["required"]);
  categorystatus = new TextField("categorystatus",["required"]);
  publishdate    = new TextField("publishdate",["required"]);
  publishtime    = new TextField("publishtime",["required"]);
  site           = new TextField("site",[]);

  categ1 = "";categ1list:any=[];
  categ2 = "";categ2list:any=[];
  categ3 = "";categ3list:any=[];

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService
  ) {}
  ngOnInit(): void {
      this.page.imgprfx = environment.imgprfx;
      this.blogHtml.value = "<h1>blogHtml</h1>";
      this.setMode();
      
      
      let data = {
          
          mode: 'INIT',
          bcno: this.page.rfno
        }
      this.http.post(environment.apiurl+'/cgi/APPSRBCATG',data).subscribe(response => {
  
        this.page.data = response;
        if(this.page.data.title) this.page.title = this.page.data.title;
        if(this.page.data.fullname) this.page.fullname = this.page.data.fullname;
        this.page.loading =false;
        
        hideWait();
      })
    }
    onEditorChanged(event: any) {
  console.log('Editor content changed:', event);
  console.log(this.blogHtml.value);
}

    validate(){

    }

      getCategories(bcno:string,index:number,initialize?:boolean){
        initialize = initialize ?? false;
        showWait();
        let data = {
          mode:'CHILD',
          site:this.site.value,
          bcno:bcno
        }
        if(!initialize){
        if(this.categ1==''){
          this.categ2 = '';
          this.categ3 = '';
        }
        if(this.categ2==''){
          this.categ3 = '';
        }
        
       }
        this.http.post(environment.apiurl+'/cgi/APPSRBCATG',data).subscribe(response => {
    
          switch (index){
            case 1:
                this.categ1list = response;
                if(initialize){
                  this.initDrop(1);
                  if(this.categ1 !== '') this.getCategories(this.categ1,2,true);
                }
                else
                  this.categ1 = '';
                break;
            case 2:
                this.categ2list = response;
                if(initialize){
                  this.initDrop(2);
                  if(this.categ2 !== '') this.getCategories(this.categ2,3,true);
                }
                else
                this.categ2 = '';
                break;
            case 3:
                this.categ3list = response;
                if(initialize){
                  this.initDrop(3);
                }
                else
                this.categ3 = '';
                break;
            
          }
          
          hideWait();
    
        });
    
      }
      initDrop(index:number){
    
        if(this.page.data.path.length<1) return;
        if(index==1)
        this.categ1list.forEach((catg:any) => {
          this.page.data.path.forEach((path:any)=>{
            if(catg.bcno==path.bcno) this.categ1 = path.bcno;
          })
        });
    
        if(index==2)
        this.categ2list.forEach((catg:any) => {
          this.page.data.path.forEach((path:any)=>{
            if(catg.bcno==path.bcno) this.categ2 = path.bcno;
          })
        });
    
        if(index==3)
        this.categ3list.forEach((catg:any) => {
          this.page.data.path.forEach((path:any)=>{
            if(catg.bcno==path.bcno) this.categ3 = path.bcno;
          })
        });
      }

    goBack(){
      this.router.navigate(['/blogs/viewcategory/'+this.page.rfno]);
    }
    setMode(){
 
        // It's the edit category route, retrieve the ID
        if (this.router.url.indexOf('/blogs/newblog')>=0) {
          this.page.entrymode = true;
        }
        if (this.router.url.indexOf('/blogs/viewblog')>=0) {
          this.page.viewmode = true;
        }
        if (this.router.url.indexOf('/blogs/editblog')>=0) {
          this.page.editmode = true;
        }
        this.route.paramMap.subscribe(params => {
          this.page.rfno = params.get('id');
        });
  
      if(this.page.entrymode) this.showUpload = true;
    }

}
