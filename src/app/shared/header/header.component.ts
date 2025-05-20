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

    constructor(private http: HttpClient,
      private router: Router,
      private route: ActivatedRoute,
      private sessionService: SessionService
    ) { }
  
  async ngOnInit() {
    const response = await this.sessionService.getSession();
    this.fullname = response.name;
  }

goHome() { // Return to home page 
  this.router.navigate(['/uniforms']);
}

toggleSidebar() { // Display or Hide the sidebar
  const sidebar = document.querySelector('.sidebar');
  sidebar!.classList.toggle('collapsed');
}

goMenu(menu: String) { //Go to selected sidebar menu with current UP
  let nhno = this.route.snapshot.paramMap.get('nhno');
  this.router.navigate([`/uniforms/${menu}/` + nhno]);
}

sidebarNav(n: number) {
  let i: number = 1;
  var sidebarlink = document.querySelector(`:nth-child(${i} of .sidebar-link)`); //Sidebar links
  var sidebarsub = document.querySelector(`.sidebar-sub-${i}`); //Sub menus of sidebar links
  var sidebarOpt = sidebarlink?.querySelector(`.arrow`); //Arrow Indicator 

  //Set option active
  while (sidebarlink) {
    if(i !== n){ //If not the selected link
    if(sidebarlink!.classList.contains('active')){
      sidebarlink!.classList.remove('active');
    }
    sidebarsub?.classList.add("closed")  //Close links that are not active
    sidebarOpt?.classList.replace("down","right"); 
    } else { //If is the selected link
    sidebarlink!.classList.toggle('active');
    if(sidebarsub?.classList.contains("closed")){
      sidebarsub?.classList.remove("closed") //Open selected link if inactive
      sidebarOpt?.classList.replace("right","down"); 
    } else {
      sidebarsub?.classList.add("closed") //Close selected link if already active
      sidebarOpt?.classList.replace("down","right"); 
    }
  }
    i++;
    sidebarlink = document.querySelector(`:nth-child(${i} of .sidebar-link)`);
    sidebarsub = document.querySelector(`.sidebar-sub-${i}`);
    sidebarOpt = sidebarlink?.querySelector(`.arrow`);
  }
}
}

