import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { focusField, getSite, hideWait, openModal, showWait, transformToSeoUrl, transformToTags } from '../../shared/utils';
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

  loadblogs:boolean = false;
  loadcateg:boolean = false;
  //Screen Fields
  categorytitle = new TextField("categorytitle", ["required"]);
  categorystatus = new TextField("categorystatus", ["required"]);
  site = new TextField("site", []);
  metatitle = new TextField("metatitle", ["required"]);
  metadescription = new TextField("metadescription", ["required"]);
  urlandhandle = new TextField("urlandhandle", ["required"]);
  tags = new TextField("tags", []);
  image = new TextField("image", ["required"]);

  categories: any = [];
  showUpload: boolean = false;
  dspblogs: boolean = true;
  blogcount:number = 0;
  childcount:number = 0;
  


  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.page.imgprfx = environment.imgprfx;

    this.setMode();
    let data = {

      mode: this.page.editmode ? 'GETCATEG' : 'INIT',
      bcno: this.page.rfno
    }
    this.http.post(environment.apiurl + '/cgi/APPSRBCATG', data).subscribe(response => {

      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      this.page.loading = false;
      
      hideWait();

      if (this.page.editmode) {
        this.categorytitle.value = this.page.data.category.desc;
        this.categorystatus.value = this.page.data.category.stat;
        this.site.value = this.page.data.category.site;
        this.metatitle.value = this.page.data.category.mett;
        this.metadescription.value = this.page.data.category.metd;
        this.urlandhandle.value = this.page.data.category.url;
        this.tags.value = this.page.data.category.metk;
        this.image.value = this.page.data.category.img;
        this.loadblogs = true;
        this.blogcount = this.page.data.category.count;
        this.childcount = this.page.data.category.catgct;

        
      }
      if (this.page.entrymode) {
        this.site.value = getSite();
        this.getCategories('', 0, false);
      }


      
    });
  }

  gotbBLogs($event: string) {
    
     
      this.getCategories('', 0, true);
  
  }
  changeImage() {
    this.showUpload = true;
  }

  saveAfterImageUpload(file: any) {
    this.image.value = file;
    if (!this.image.validate()) this.setTopErrorID(this.image.htmlid);
    focusField(this.page.topErrorID);

    if (!this.page.valid) {
      hideWait();
      return;
    }

    //Save Payload:
    let data = {
      mode: this.page.entrymode ? 'NEWCATEG' : 'EDITCATEG',
      bcstat: this.categorystatus.value,
      bcsite: this.site.value,
      bcdesc: this.categorytitle.value,
      bcmett: this.metatitle.value,
      bcmetd: this.metadescription.value,
      bcmetk: this.tags.value,
      bcurl: this.urlandhandle.value,
      bcimg: file,
      bcbcno: this.page.rfno,
      bcbcnp: this.getbcnp()

    }

    this.http.post(environment.apiurl + '/cgi/APPSRBCATG', data).subscribe(response => {

      this.page.data = response;
      this.goBack();

    });
  }

  uploadImage() {
    this.dataService.triggerChild('');
  }

  StartEntry() {
    this.router.navigate(['/blogs/newcategory']);
  }

  editBlog() {
    this.router.navigate(['/blogs/editblog/' + this.page.rfno]);
  }

  validate() {
    this.page.topErrorID = "";
    this.page.valid = true;
    if (!this.categorytitle.validate()) this.setTopErrorID(this.categorytitle.htmlid);
    if (!this.categorystatus.validate()) this.setTopErrorID(this.categorytitle.htmlid);
    if (!this.site.validate()) this.setTopErrorID(this.site.htmlid);
    if (!this.metatitle.validate()) this.setTopErrorID(this.metatitle.htmlid);
    if (!this.metadescription.validate()) this.setTopErrorID(this.metadescription.htmlid);
    if (!this.urlandhandle.validate()) this.setTopErrorID(this.urlandhandle.htmlid);
    if (!this.tags.validate()) this.setTopErrorID(this.tags.htmlid);



    focusField(this.page.topErrorID);

    if (this.page.valid) {
      showWait();
      if (this.showUpload)
        this.uploadImage();
      else
        this.saveAfterImageUpload(this.image.value);
    }


  }
  buildUrl():string{
    let url = ""
    this.categories.forEach((categ: any)=>{
      categ.list.forEach((list: any)=>{
        if(list.bcno==categ.value){
          if(url=="")
            url=transformToSeoUrl(list.url);
          else
            url= url + '/' +  transformToSeoUrl(list.url);
        }
      })
    })
    if(url=="")
      url=transformToSeoUrl(this.urlandhandle.value);
    else
      url= url + '/' +  transformToSeoUrl(this.urlandhandle.value);
    return url;
  }

setSeo(){
      this.urlandhandle.value = transformToSeoUrl(this.categorytitle.value);
      this.metatitle.value = transformToTags(this.categorytitle.value);
    }
    cleanMeta(){
      this.metatitle.value = transformToTags(this.metatitle.value);
    }
    cleanUrl(){
      this.urlandhandle.value = transformToSeoUrl(this.urlandhandle.value);
    }

  getbcnp() {
    let bcnp = this.categories[0]?.value;
    this.categories.forEach((categ: any) => {
      if (categ.value !== '') bcnp = categ.value;
    });
    return bcnp;
  }

  setTopErrorID(errorID: string) {
    if (this.page.topErrorID !== "") return;
    this.page.topErrorID = errorID;
    this.page.valid = false;

  }

  getCategories(bcno: string, index: number, initialize?: boolean) {
    initialize = initialize ?? false;
    showWait();
    let data = {
      mode: 'CHILD',
      site: this.site.value,
      bcno: bcno
    }
    if (!initialize) {


      for (let next = index; next < this.categories.length; next++) {
        this.categories[next].value = "";
        this.categories[next].list = [];
      }

    }

    this.http.post(environment.apiurl + '/cgi/APPSRBCATG', data).subscribe(response => {

      if (this.categories.length - 1 < index) {
        this.categories.push({ value: "", list: [] });
      }
      if (bcno !== '' || index == 0) {
        this.categories[index].list = response;
        if (initialize) {
          this.initDrop(index);
          if (this.categories[index].value !== '') 
            this.getCategories(this.categories[index].value, index + 1, true);
          else{
            this.loadcateg = true;
          }

        }
        else {
          this.categories[index].value = '';
        }
      }
      


      hideWait();

    });

  }
  initDrop(index: number) {

    if (this.page.data.path.length < 1) return;
    this.categories.forEach((categArr: any) => {
      categArr.list.forEach((catg: any) => {
        this.page.data.path.forEach((path: any) => {
          if (catg.bcno == path.bcno) categArr.value = path.bcno;
        })
      });
    });

  }
  cancelEntry() {
    if(this.page.changes)
      openModal('cancelEntry');
    else
      this.goBack();
  }
  setMode() {
    if (this.router.url === '/blogs/newcategory') {
      this.page.entrymode = true;
      this.page.rfno = null; // No category ID for new category
    } else {
      // It's the edit category route, retrieve the ID
      if (this.router.url.indexOf('/blogs/editcategory') >= 0) {
        this.page.editmode = true;
      }
      this.route.paramMap.subscribe(params => {
        this.page.rfno = params.get('id');
      });
    }

    if (this.page.entrymode) this.showUpload = true;
  }

  goBack() {
    this.router.navigate(['/blogs/categories']);
  }

  newBlog() {
    this.router.navigate(['/blogs/newblog/']);
  }


  counter(n: number): number[] {
    return Array(n).fill(0).map((_, i) => i + 1);
  }

  startDelete() {

    openModal('deleteCategory');

  }

  onDelete() {

    let data = {
      mode: 'DELETE',
      bcno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPLMBCATG', data).subscribe(response => {
      this.goBack();
    });
  }
}
