import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { hideWait } from '../../shared/utils';

@Component({
  selector: 'app-blog',
  standalone: false,
  
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  page = new Page();

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private dataService: DataService
  ) {}
  ngOnInit(): void {
      this.page.imgprfx = environment.imgprfx;
  
      
      let data = {
          
          mode: 'INIT',
          bcno: this.page.rfno
        }
      this.http.post(environment.apiurl+'/cgi/APPSRBCATG',data).subscribe(response => {
  
        this.page.data = response;
        if(this.page.data.title) this.page.title = this.page.data.title;
        if(this.page.data.fullname) this.page.fullname = this.page.data.fullname;
        this.page.loading =false;
        
        hideWait();
      })
    }

    goBack(){
      window.history.back();
    }

}
