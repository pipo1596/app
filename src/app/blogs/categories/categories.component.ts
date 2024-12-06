import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  data: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    
    this.http.get('https://10.32.234.54/cgi/APPBLOGCAT',{withCredentials:true}).subscribe(response => {

      this.data = response;
      if(this.data.title) this.title = this.data.title;
      if(this.data.fullname) this.fullname = this.data.fullname;
      document.getElementById("loader")?.classList.add("d-none");
      this.loading =false;
    });
  }


}
