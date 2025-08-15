import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-sidebar',
  standalone:false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() title : string = "";
  @Input() menu : string = "";
  fullname : string = "";
  imgprfx = environment.logoprfx;
  showSidebar = true;
  expanded: String = "";

    constructor(private http: HttpClient,
      private router: Router,
      private route: ActivatedRoute,
      private sessionService: SessionService
    ) { }
  
  async ngOnInit() {
    localStorage.clear();
    const response = await this.sessionService.getSession();
    this.fullname = response.name;
  }

goMenu(menu: String) { //Go to selected sidebar menu with current UP
  let nhno = this.route.snapshot.paramMap.get('nhno');
  this.router.onSameUrlNavigation = 'reload';
  localStorage.setItem('UP_AUTH','Y');
  this.router.navigate([`/uniforms/${menu}/` + nhno] );
}

}

