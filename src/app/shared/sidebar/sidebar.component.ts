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
  @Input() exp : string = "";
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
    if(this.exp){
      this.expanded = this.exp
    }
    localStorage.clear();
    const response = await this.sessionService.getSession();
    this.fullname = response.name;
  }

goMenu(menu: String) { //Go to selected sidebar menu with current UP
  let nhno = this.route.snapshot.paramMap.get('nhno');
  this.router.onSameUrlNavigation = 'reload';
  localStorage.setItem('UP_AUTH','Y');
  localStorage.setItem('expanded',this.expanded.toString());
  this.router.navigate([`/uniforms/${menu}/` + nhno] );
}

getMenu(){
  let menu = ""
  let link = this.router.url.split('/')
  if(link[2]){
    menu = link[2]
  }
  return menu
}

}

