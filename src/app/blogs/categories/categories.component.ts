import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { hideWait, openModal, scrollToTop, showToast, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  standalone: false,
  
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  title = '';
  fullname = '';
  loading=true;
  entrymode = false;
  data: any;
  imgprfx = environment.imgprfx;

  constructor(private http: HttpClient,
              private router: Router
  ) {}

  ngOnInit(): void {
    
    this.http.get('https://10.32.234.54/cgi/APPLMBCATG',{withCredentials:true}).subscribe(response => {

      this.data = response;
      if(this.data.title) this.title = this.data.title;
      if(this.data.fullname) this.fullname = this.data.fullname;
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
    openModal('deleteCategory');

  }
  CancelEntry(){
    showWait();
    this.entrymode = false;
    hideWait();
  }
  counter(n: number): number[] {
    return Array(n).fill(0).map((_, i) => i + 1);
  }
  onDelete() {
     showToast();
     hideWait(300);
    }

}
