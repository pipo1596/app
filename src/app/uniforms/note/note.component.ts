import { Component } from '@angular/core';
import { Page} from '../../shared/textField';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-note',
  standalone: false,
  templateUrl: './note.component.html',
  styleUrl: './note.component.css'
})
export class NoteComponent {
  page = new Page();
  drop = false; // More Actions

  // Parms
  nhno:any
  nono:any
  note = "";
  upct = "0";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { hideWait(); }

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.setMode();

      let data = {
        mode: 'getInfo',
        nhno: this.nhno,
        nono: this.nono,
        edit: (this.page.editmode) ? 'Y' : ''

      }

      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNO', data).subscribe(response => {
        this.page.data = response;
        if (this.page.data.menu) this.page.menu = this.page.data.menu;
        if (this.page?.data?.info?.nono) this.nono = this.page.data.info.nono;
        if (this.page?.data?.info?.note) this.note = this.page.data.info.note;
        if (this.page?.data?.info?.upct) this.upct = this.page.data.info.upct;
      });

    this.page.loading = false;
    hideWait();
  }

  setMode() {
    if (this.router.url.indexOf('/uniforms/newnote') >= 0) {
      this.page.entrymode = true;
    }
    if (this.router.url.indexOf('/uniforms/editnote') >= 0) {
      this.page.editmode = true;
    }
    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.nono = params.get('nono')
    });
  }

  loadNote(mode: string){
    showWait();

    let data = {
      mode: mode,
      nhno: this.nhno,
      nono: this.nono,
      note: (mode !== 'delete') ? this.note : '',
      upct: (mode == 'update') ? this.upct : ''
    }
    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNO', data).subscribe(response => {
      this.page.data = response;

      if (mode !== 'update') {
        if (this.page.data.result == 'pass' && this.page.data.nhno){
          localStorage.setItem('UP_AUTH','Y');
          this.router.navigate(['/uniforms/notes/' + this.page.data.nhno]);
        }
      }
      this.page.loading = false;
      hideWait();
    });
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/notes/' + this.nhno]);
  }
}
