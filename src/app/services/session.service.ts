import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Page } from '../shared/textField';
import { Session } from '../shared/header/session';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {

  page = new Page();

  constructor(private http: HttpClient) {
  }

  async getSession(): Promise<Session> {
    var session: Session = {
        user: "",
        name: "",
        auth: "",
        curr: "",
        dfmt: "",
        nfmt: "",
        emal: "",
    };
    try {
      const response = await lastValueFrom( this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSECURE', {}));
      this.page.data = response
      session.user = this.page.data.user
      session.name = this.page.data.name
      session.auth = this.page.data.auth
      session.curr = this.page.data.curr
      session.dfmt = this.page.data.dfmt
      session.nfmt = this.page.data.nfmt
      session.emal = this.page.data.emal
      return session;
    } catch (error) {
      console.error('An error occurred:', error);
      throw error;
    }
  }
}
