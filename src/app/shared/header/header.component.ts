import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Session } from './session';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-header',
  standalone:false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title : string = "";
  fullname : string = "";
  imgprfx = environment.logoprfx;

    constructor(private http: HttpClient,
      private router: Router,
      private sessionService: SessionService
    ) { }
  
  async ngOnInit() {
    const response = await this.sessionService.getSession();
    this.fullname = response.name;
  }
}

