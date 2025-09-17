import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { showWait, hideWait } from '../../shared/utils';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cxml-configs',
  standalone: false,
  templateUrl: './cxml-configs.component.html',
  styleUrl: './cxml-configs.component.css'
})
export class CxmlConfigsComponent {
  page = new Page();

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    hideWait();
    this.page.loading = false;
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getConfig('getInfo','')
  }

  getConfig(mode: any, level: any){
    showWait();
      let data = {
        mode: mode,
        nhno: this.page.rfno,
        level: level
      }

      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPGETCXML', data).subscribe(response => {
        this.page.data = response;
        if (this.page.data?.menu) this.page.menu = this.page.data.menu;
        if (this.page.data?.level) this.selectConfig(this.page.data.level);
        hideWait();
        this.page.loading = false;
      });
  }

  selectConfig(level: any){
    if(level == 'CUSTOMER'){
      localStorage.setItem('UP_AUTH','Y');
      this.router.navigate(['/uniforms/cxmlcustomers/' + this.page.rfno]);
    } else if (level == 'CATEGORY') {
      localStorage.setItem('UP_AUTH','Y');
      this.router.navigate(['/uniforms/cxmlcategories/' + this.page.rfno]);
    }
  }
}
