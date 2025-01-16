import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { dbtodspdate, dbtodsptime, focusField, getSite, hideWait, openModal, showWait } from '../../shared/utils';

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
  author         = new TextField("author",["required"]);
  metatitle      = new TextField("metatitle",["required"]);
  metadescription= new TextField("metadescription",["required"]);
  site           = new TextField("site",[]);
  urlandhandle   = new TextField("urlandhandle",["required"]);
  tags           = new TextField("tags",[]);
  primarycategory= new TextField("tags",[]);
  image          = new TextField("image",["required"]);

  categories:any = [[]];//Multidimensional Array to support structure

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
      this.http.post(environment.apiurl+'/cgi/APPSRBLOG',data).subscribe(response => {
  
        this.page.data = response;
        if(this.page.data.title) this.page.title = this.page.data.title;
        if(this.page.data.fullname) this.page.fullname = this.page.data.fullname;
        this.page.loading =false;
        
        hideWait();
        if(this.page.viewmode || this.page.editmode){
                this.blogTitle.value        = this.page.data.blog.desc;
                this.categorystatus.value   = this.page.data.blog.stat;
                this.publishdate.value      = dbtodspdate(this.page.data.blog.pbdt);
                this.publishtime.value      = dbtodsptime(this.page.data.category.pbtm);
                this.site.value             = this.page.data.blog.site;
                this.metatitle.value        = this.page.data.blog.mett;
                this.metadescription.value  = this.page.data.blog.metd;
                this.urlandhandle.value     = this.page.data.blog.url;
                this.tags.value             = this.page.data.blog.metk;
                this.image.value            = this.page.data.blog.img;
                
        
              }    
        
              if(this.page.entrymode ) {
                this.site.value = getSite();
                let now = new Date();
                this.publishdate.value = now.toISOString().split('T')[0];
                this.publishtime.value = '00:00';
                this.getCategories('',0,0,false);
                this.primarycategory.value="0";
              } else{
                this.getCategories('',0,0,true);
              }
            
      })
    }

     cancelEntry(){
        openModal('cancelEntry');
      }
      startDelete(){

      }
    onEditorChanged(event: any) {
      console.log('Editor content changed:', event);
      console.log(this.blogHtml.value);
    }

    validate(){

    }
    changeImage(){
         this.showUpload = true;
      }
      setTopErrorID(errorID:string){
        if(this.page.topErrorID!=="") return;
        this.page.topErrorID = errorID;
        this.page.valid = false;
    
      }
      saveAfterImageUpload(file: any) {
        this.image.value = file;
        if(!this.image.validate()) this.setTopErrorID(this.image.htmlid);
        focusField(this.page.topErrorID);
    
        if(!this.page.valid){
          hideWait();
          return;
        }
    
        //Save Payload:
        let data = {
          mode: this.page.entrymode?'NEWCATEG':'EDITCATEG',
          bcstat: this.categorystatus.value,
          bcsite: this.site.value,
          bcdesc: this.blogTitle.value,
          bcmett: this.metatitle.value,
          bcmetd: this.metadescription.value,
          bcmetk: this.tags.value,
          bcurl : this.urlandhandle.value,
          bcaddt: this.publishdate.value.replaceAll('-',''),
          bcadtm: this.publishtime.value.replaceAll(':',''),
          bcimg : file,
          bcbcno: this.page.rfno
    
        }
    
        this.http.post(environment.apiurl+'/cgi/APPSRBLOG',data).subscribe(response => {
    
          this.page.data = response;
          this.goBack();
          
        });
      }
    
      uploadImage() {
        this.dataService.triggerChild('');
      }
    
      addCategory(){

        this.categories.push([]);
        this.getCategories('',this.categories.length-1,0);

      }
      removeCategory(indexo:number){

        this.categories.pop();
        if(parseInt(this.primarycategory.value)==indexo) 
          this.primarycategory.value = "0";

      }

      getCategories(bcno:string,indexo:number,indexi:number,initialize?:boolean){
        initialize = initialize ?? false;
        showWait();
        let data = {
          mode:'CHILD',
          site:this.site.value,
          bcno:bcno
        }
        if(!initialize){
    
        
        for (const [indexi, categ] of this.categories[indexo].entries()) {
          if(this.categories[indexo][indexi].value == ""){
            if(indexi<this.categories[indexo].length-1) {
              this.categories[indexo][indexi+1].value = "";
              this.categories[indexo][indexi+1].list = [];
            }
          }
        }
       }
       
        this.http.post(environment.apiurl+'/cgi/APPSRBLOG',data).subscribe(response => {
    
          if(this.categories[indexo].length-1 < indexi){
            this.categories[indexo].push({value:"",list:[]});
          }
          if(bcno!=='' || indexi==0){
              this.categories[indexo][indexi].list = response;
                if(initialize){
                  
                  if(this.categories[indexo][indexi].value !== '') 
                    this.getCategories(this.categories[indexo][indexi].value,indexo,indexi+1,true);
                }
                else{
                  this.categories[indexo][indexi].value = '';
                }
          }
                
          
          hideWait();
    
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
