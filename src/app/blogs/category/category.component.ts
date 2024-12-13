import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { focusField, hideWait } from '../../shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { Page, TextField } from '../../shared/textField';

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

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute
  ) {}

  
  ngOnInit(): void {
    
    this.setMode();
    this.http.post('https://10.32.234.54/cgi/APPSKLTN',{mode:"TEST"},{withCredentials:true}).subscribe(response => {

      this.page.data = response;
      if(this.page.data.title) this.page.title = this.page.data.title;
      if(this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      this.page.loading =false;
      hideWait();
    });
  }

  saveCategory(){
    this.page.topErrorID = "";
    if(!this.categorytitle.validate()) this.setTopErrorID(this.categorytitle.htmlid);
    if(!this.categorystatus.validate()) this.setTopErrorID(this.categorytitle.htmlid);
    if(!this.publishdate.validate()) this.setTopErrorID(this.publishdate.htmlid);
    if(!this.publishtime.validate()) this.setTopErrorID(this.publishtime.htmlid);

    focusField(this.page.topErrorID);


  }

  setTopErrorID(errorID:string){
    if(this.page.topErrorID!=="") return;
    this.page.topErrorID = errorID;

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
