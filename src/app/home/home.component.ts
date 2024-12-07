import { Component} from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { hideWait } from '../shared/utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports:[SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  title = '';
  fullname = '';
  loading=true;
  data: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    
    this.http.get('https://10.32.234.54/cgi/APPHOME',{withCredentials:true}).subscribe(response => {

      this.data = response;
      if(this.data.title) this.title = this.data.title;
      if(this.data.fullname) this.fullname = this.data.fullname;
      hideWait(200);
      this.loading =false;
    });
  }

}
