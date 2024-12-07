import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';

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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    
    this.http.get('https://10.32.234.54/cgi/APPBLOGCAT',{withCredentials:true}).subscribe(response => {

      this.data = response;
      if(this.data.title) this.title = this.data.title;
      if(this.data.fullname) this.fullname = this.data.fullname;
      this.loading =false;
      hideWait(200);
    });
  }

  StartEntry(){
    showWait();
    this.entrymode = true;
    hideWait(400);
  }
  CancelEntry(){
    showWait();
    this.entrymode = false;
    hideWait(400);
  }
  counter(n: number): number[] {
    return Array(n).fill(0).map((_, i) => i + 1);
  }


}
