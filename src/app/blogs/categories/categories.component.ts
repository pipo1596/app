import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { hideWait, openModal, scrollToTop, showToast, showWait } from '../../shared/utils';
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

  title = '';
  fullname = '';
  search="";
  pvsearch="";
  loading=true;
  entrymode = false;
  imgprfx = environment.imgprfx;

  page = new Page();

  constructor(private http: HttpClient,
              private router: Router
  ) {}

  ngOnInit(): void {

    let data = {
      mode: 'SEARCH'
      

    }
    
    this.http.post('https://10.32.234.54/cgi/APPLMBCATG',data).subscribe(response => {

      this.page.data = response;
      this.updateLocations();
      if(this.page.data.title) this.title = this.page.data.title;
      if(this.page.data.fullname) this.fullname = this.page.data.fullname;
      this.loading =false;
      scrollToTop();
      hideWait();
    });
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
  CancelEntry(){
    showWait();
    this.entrymode = false;
    hideWait();
  }
  Search(force?:boolean){  
    force = force ?? false;
    if(!force && this.search == this.pvsearch) return;
    
    showWait();

    let data = {
      mode: 'SEARCH',
      search: this.search    
    }
    this.pvsearch = this.search;
    this.http.post('https://10.32.234.54/cgi/APPLMBCATG',data).subscribe(response => {
      this.page.data = response; 
      this.updateLocations();
      scrollToTop();
      hideWait();
    });
  }
  updateLocations(){
    this.page.data?.categories.forEach((categ: any) => {

      categ.parents = [];
      
    });
  }
  onDelete() {
     
     let data = {
      mode: 'DELETE',
      bcno: this.page.rfno    
    }
    
    this.http.post('https://10.32.234.54/cgi/APPLMBCATG',data).subscribe(response => {
      showToast();
      
      this.Search(true);
    });
    }

}
