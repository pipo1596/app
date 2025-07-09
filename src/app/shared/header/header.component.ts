import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-header',
  standalone:false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title : string = "";
  @Input() menu : string = "";
  fullname : string = "";
  imgprfx = environment.logoprfx;
  showSidebar = false;
  expanded: String = "";

    constructor(private http: HttpClient,
      private router: Router,
      private route: ActivatedRoute,
      private sessionService: SessionService
    ) { }
  
  async ngOnInit() {
    const response = await this.sessionService.getSession();
    this.fullname = response.name;
  }

goMenu(menu: String) { //Go to selected sidebar menu with current UP
  let nhno = this.route.snapshot.paramMap.get('nhno');
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate([`/uniforms/${menu}/` + nhno], { skipLocationChange: true });
}

}

