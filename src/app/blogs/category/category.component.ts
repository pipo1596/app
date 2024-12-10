import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { hideWait, showWait } from '../../shared/utils';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-category',
  standalone: false,
  
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
  title = '';
  fullname = '';
  loading=true;
  entrymode = false;
  data: any;
  imgprfx = environment.imgprfx;

  categoryId: string | null = null;
  isNewCategory: boolean = false
  isEditCategory: boolean = false
  isViewCategory: boolean = false

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute
  ) {}

  
  ngOnInit(): void {
    
    this.setMode();
    this.http.get('https://10.32.234.54/cgi/APPSRBCATG',{withCredentials:true}).subscribe(response => {

      this.data = response;
      if(this.data.title) this.title = this.data.title;
      if(this.data.fullname) this.fullname = this.data.fullname;
      this.loading =false;
      hideWait();
    });
  }

  setMode(){
    if (this.router.url === '/blogs/newcategory') {
      this.isNewCategory = true;
      this.categoryId = null; // No category ID for new category
    } else {
      // It's the edit category route, retrieve the ID
      if (this.router.url.indexOf('/blogs/viewcategory')>=0) {
        this.isViewCategory = true;
      }
      if (this.router.url.indexOf('/blogs/editcategory')>=0) {
        this.isEditCategory = true;
      }
      this.route.paramMap.subscribe(params => {
        this.categoryId = params.get('id');
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
