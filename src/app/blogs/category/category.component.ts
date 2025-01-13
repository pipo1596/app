import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { focusField, getSite, hideWait, openModal, showWait } from '../../shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { Page, TextField } from '../../shared/textField';
import { DataService } from '../../services/data-trigger.service';

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
  categorytitle  = new TextField("categorytitle",["required","minlength7"]);
  categorystatus = new TextField("categorystatus",["required"]);
  publishdate    = new TextField("publishdate",["required"]);
  publishtime    = new TextField("publishtime",["required"]);
  site           = new TextField("site",[]);
  metatitle      = new TextField("metatitle",["required"]);
  metadescription= new TextField("metadescription",["required"]);
  urlandhandle   = new TextField("urlandhandle",["required"]);
  tags           = new TextField("tags",["required"]);
  image          = new TextField("image",["required"]);

  categ1 = "";categ1list:any=[];
  categ2 = "";categ2list:any=[];
  categ3 = "";categ3list:any=[];
  categ4 = "";categ4list:any=[];
  categ5 = "";categ5list:any=[];
  


  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService
  ) {}

  
  ngOnInit(): void {
    
    
    this.setMode();
    let data = {
        mode:'INIT'
      }
    this.http.post('https://10.32.234.54/cgi/APPSRBCATG',data).subscribe(response => {

      this.page.data = response;
      if(this.page.data.title) this.page.title = this.page.data.title;
      if(this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      this.page.loading =false;
      
      hideWait();
      
      if(this.page.entrymode) {
        this.site.value = getSite();
        this.getCategories('',1);
      }     
    });
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
      bcmetk: this.metadescription.value,
      bcimg : file,
      bcbcnp: this.getbcnp()

    }

    
    
    this.http.post('https://10.32.234.54/cgi/APPSRBCATG',data).subscribe(response => {

      this.page.data = response;
      this.goBack();
      
    });
  }
  uploadImage() {
    this.dataService.triggerChild('');
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
      this.uploadImage(); 
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
      let bcnp = this.categ1;
          if(this.categ2!=='')bcnp = this.categ2;
          if(this.categ3!=='')bcnp = this.categ3;
          if(this.categ4!=='')bcnp = this.categ4;
          if(this.categ5!=='')bcnp = this.categ5;
    return bcnp;
  }

  setTopErrorID(errorID:string){
    if(this.page.topErrorID!=="") return;
    this.page.topErrorID = errorID;
    this.page.valid = false;

  }

  getCategories(bcno:string,index:number){
    showWait();
    let data = {
      mode:'CHILD',
      site:this.site.value,
      bcno:bcno
    }
    if(this.categ1==''){
      this.categ2 = '';
      this.categ3 = '';
      this.categ4 = '';
      this.categ5 = '';
    }
    if(this.categ2==''){
      this.categ3 = '';
      this.categ4 = '';
      this.categ5 = '';
    }
    if(this.categ3==''){
      this.categ4 = '';
      this.categ5 = '';
    }
    if(this.categ4==''){
      this.categ5 = '';
    }
    this.http.post('https://10.32.234.54/cgi/APPSRBCATG',data).subscribe(response => {

      switch (index){
        case 1:
            this.categ1list = response;
            this.categ1 = '';
            break;
        case 2:
            this.categ2list = response;
            this.categ2 = '';
            break;
        case 3:
            this.categ3list = response;
            this.categ3 = '';
            break;
        case 4:
            this.categ4list = response;
            this.categ4 = '';
            break;
        case 5:
            this.categ5list = response;
            this.categ5 = '';
            break;
        
      }
      hideWait();

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
  }

  goBack(){
    this.router.navigate(['/blogs/categories']);
  }

  counter(n: number): number[] {
    return Array(n).fill(0).map((_, i) => i + 1);
  }
}
