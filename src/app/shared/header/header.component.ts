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
  expanded: String = "";

    constructor(private http: HttpClient,
      private router: Router,
      private route: ActivatedRoute,
      private sessionService: SessionService
    ) { }
  
  async ngOnInit() {
    // localStorage.clear();
    const response = await this.sessionService.getSession();
    this.fullname = response.name;
  }


}

