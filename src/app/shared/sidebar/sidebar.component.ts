import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SessionService } from '../../services/session.service';
import { LayoutService } from '../../services/layout.service';

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

  get expanded(): string {
    return this.layout.expandedValue;
  }
  set expanded(value: string) {
    this.layout.expandedValue = value;
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private layout: LayoutService
  ) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => this.syncExpandedToRoute());
  }

  async ngOnInit() {
    this.syncExpandedToRoute();
    const response = await this.sessionService.getSession();
    this.fullname = response.name;
  }

  private syncExpandedToRoute() {
    const current = this.getMenu();
    if (['uplist','vasprice'].some(m => current.includes(m))) {
      this.expanded = 'pricing';
    } else if (['product','categ','customization','warehouse','samtrack'].some(m => current.includes(m))) {
      this.expanded = 'catalog';
    } else if (['image','note'].some(m => current.includes(m))) {
      this.expanded = 'content';
    } else if (['import','export','cxmlconfig'].some(m => current.includes(m))) {
      this.expanded = 'tools';
    } else if (['OERP53','OERP52','OERP302'].some(m => current.includes(m))) {
      this.expanded = 'reports';
    } else {
      this.expanded = '';
    }
  }

  goMenu(menu: String) {
    let child = this.route.snapshot;
    while (child.firstChild) { child = child.firstChild; }
    let nhno = child.paramMap.get('nhno');
    this.router.onSameUrlNavigation = 'reload';
    localStorage.setItem('UP_AUTH','Y');
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