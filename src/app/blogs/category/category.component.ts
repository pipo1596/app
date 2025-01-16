import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { dbtodspdate, dbtodsptime, focusField, getSite, hideWait, openModal, showWait } from '../../shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { Page, TextField } from '../../shared/textField';
import { DataService } from '../../services/data-trigger.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-category',
  standalone: false,
  
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  //This contains all the share page data:
  page = new Page();

  
  //Screen Fields
  categorytitle  = new TextField("categorytitle",["required"]);
  categorystatus = new TextField("categorystatus",["required"]);
  publishdate    = new TextField("publishdate",["required"]);
  publishtime    = new TextField("publishtime",["required"]);
  site           = new TextField("site",[]);
  metatitle      = new TextField("metatitle",["required"]);
  metadescription= new TextField("metadescription",["required"]);
  urlandhandle   = new TextField("urlandhandle",["required"]);
  tags           = new TextField("tags",[]);
  image          = new TextField("image",["required"]);


  categories:any = [];
  showUpload:boolean = false;


  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService
  ) {}
  
  ngOnInit(): void {
    this.page.imgprfx = environment.imgprfx;

    this.setMode();
    let data = {
        
        mode: this.page.viewmode || this.page.editmode?'GETCATEG':'INIT',
        bcno: this.page.rfno
      }
    this.http.post(environment.apiurl+'/cgi/APPSRBCATG',data).subscribe(response => {

      this.page.data = response;
      if(this.page.data.title) this.page.title = this.page.data.title;
      if(this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      this.page.loading =false;
      
      hideWait();

      if(this.page.viewmode || this.page.editmode){
        this.categorytitle.value    = this.page.data.category.desc;
        this.categorystatus.value   = this.page.data.category.stat;
        this.publishdate.value      = dbtodspdate(this.page.data.category.addt);
        this.publishtime.value      = dbtodsptime(this.page.data.category.adtm);
        this.site.value             = this.page.data.category.site;
        this.metatitle.value        = this.page.data.category.mett;
        this.metadescription.value  = this.page.data.category.metd;
        this.urlandhandle.value     = this.page.data.category.url;
        this.tags.value             = this.page.data.category.metk;
        this.image.value            = this.page.data.category.img;
        

      }    

      if(this.page.entrymode ) {
        this.site.value = getSite();
        let now = new Date();
        this.publishdate.value = now.toISOString().split('T')[0];
        this.publishtime.value = '00:00';
        this.getCategories('',0,false);
      } else{
        this.getCategories('',0,true);
      }
    });
  }
 
  defaultCategories(){
    
    this.getCategories('',0);

    for (let i = 0; i < this.page.data.path.length-1; i++) {
      this.getCategories(this.page.data.path[i].bcno,i+1,true);
    }
    
    
    
  }

  changeImage(){
     this.showUpload = true;
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
      bcdesc: this.categorytitle.value,
      bcmett: this.metatitle.value,
      bcmetd: this.metadescription.value,
      bcmetk: this.tags.value,
      bcurl : this.urlandhandle.value,
      bcaddt: this.publishdate.value.replaceAll('-',''),
      bcadtm: this.publishtime.value.replaceAll(':',''),
      bcimg : file,
      bcbcno: this.page.rfno,
      bcbcnp: this.getbcnp()

    }

    this.http.post(environment.apiurl+'/cgi/APPSRBCATG',data).subscribe(response => {

      this.page.data = response;
      this.goBack();
      
    });
  }

  uploadImage() {
    this.dataService.triggerChild('');
  }

  StartEntry(){
    this.router.navigate(['/blogs/newcategory']);
  }

  validate(){
    this.page.topErrorID = "";
    this.page.valid = true;
    if(!this.categorytitle.validate()) this.setTopErrorID(this.categorytitle.htmlid);
    if(!this.categorystatus.validate()) this.setTopErrorID(this.categorytitle.htmlid);
    if(!this.publishdate.validate()) this.setTopErrorID(this.publishdate.htmlid);
    if(!this.publishtime.validate()) this.setTopErrorID(this.publishtime.htmlid);
    if(!this.site.validate()) this.setTopErrorID(this.site.htmlid);
    if(!this.metatitle.validate()) this.setTopErrorID(this.metatitle.htmlid);
    if(!this.metadescription.validate()) this.setTopErrorID(this.metadescription.htmlid);
    if(!this.urlandhandle.validate()) this.setTopErrorID(this.urlandhandle.htmlid);
    if(!this.tags.validate()) this.setTopErrorID(this.tags.htmlid);

    

    focusField(this.page.topErrorID);

    if(this.page.valid){
      showWait();
      if(this.showUpload) 
        this.uploadImage(); 
      else
        this.saveAfterImageUpload(this.image.value);
    }


  }

  preload(){
    //For easier testing:
    let now = new Date();
    this.categorytitle.value = 'test title';
    this.categorystatus.value = 'P';
    this.publishdate.value = now.toISOString().split('T')[0];
    this.publishtime.value = now.toISOString().substring(11,16);
    this.metatitle.value   = 'test meta title';
    this.metadescription.value = 'test meta description';
    this.urlandhandle.value   = 'test url and handle';
    this.tags.value = 'test tags value'; 

  }

  getbcnp(){
      let bcnp = this.categories[0]?.value;
      this.categories.forEach((categ: any) => {
        if(categ.value!=='')bcnp = categ.value;
      });
    return bcnp;
  }

  setTopErrorID(errorID:string){
    if(this.page.topErrorID!=="") return;
    this.page.topErrorID = errorID;
    this.page.valid = false;

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

    
    for (const [index, categ] of this.categories.entries()) {
      if(this.categories[index].value == ""){
        if(index<this.categories.length-1) {
          this.categories[index+1].value = "";
          this.categories[index+1].list = [];
        }
      }
    }
   }
   
    this.http.post(environment.apiurl+'/cgi/APPSRBCATG',data).subscribe(response => {

      if(this.categories.length-1 < index){
        this.categories.push({value:"",list:[]});
      }
      if(bcno!=='' || index==0){
          this.categories[index].list = response;
            if(initialize){
              this.initDrop(index);
              if(this.categories[index].value !== '') this.getCategories(this.categories[index].value,index+1,true);
            }
            else{
              this.categories[index].value = '';
            }
      }
            
      
      hideWait();

    });

  }
  initDrop(index:number){
    
    if(this.page.data.path.length<1) return;
    this.categories.forEach((categArr:any) => {
      categArr.list.forEach((catg:any) => {
      this.page.data.path.forEach((path:any)=>{
        if(catg.bcno==path.bcno) categArr.value = path.bcno;
      })
    });
  });

  }
  cancelEntry(){
    openModal('cancelEntry');
  }
  setMode(){
    if (this.router.url === '/blogs/newcategory') {
      this.page.entrymode = true;
      this.page.rfno = null; // No category ID for new category
    } else {
      // It's the edit category route, retrieve the ID
      if (this.router.url.indexOf('/blogs/viewcategory')>=0) {
        this.page.viewmode = true;
      }
      if (this.router.url.indexOf('/blogs/editcategory')>=0) {
        this.page.editmode = true;
      }
      this.route.paramMap.subscribe(params => {
        this.page.rfno = params.get('id');
      });
    }

    if(this.page.entrymode) this.showUpload = true;
  }

  goBack(){
    this.router.navigate(['/blogs/categories']);
  }

  newBlog(){
    this.router.navigate(['/blogs/newblog/'+this.page.rfno]);
  }


  counter(n: number): number[] {
    return Array(n).fill(0).map((_, i) => i + 1);
  }
  
  startDelete(){
    
    openModal('deleteCategory');

  }

  onDelete() {
       
       let data = {
        mode: 'DELETE',
        bcno: this.page.rfno    
      }
      
      this.http.post(environment.apiurl+'/cgi/APPLMBCATG',data).subscribe(response => {
        this.goBack();
      });
      }
}
