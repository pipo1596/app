import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-notes',
  standalone: false,
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.css'
})
export class NotesComponent {
  page = new Page();
  drop = false;

  //Search
  srch = "";

  //Paging
  p: number = 1;
  itemsPerPage: number = 10;
  total: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    hideWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getNotes(this.srch);
  }

  getNotes(note: string) {
    this.srch = note
    showWait();
    let data = {
      nhno: this.page.rfno,
      srch: this.srch,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }
    
    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNO', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.total) this.total = this.page.data.total;
      this.page.loading = false;
      hideWait();
    });
  }

  editNote(nono: string) {
    this.router.navigate(['/uniforms/editnote/' + this.page.rfno + '/' + nono]);
  }

  deleteNote(nono: string) {
    showWait();
    
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      nono: nono,
      note: '',
      upct: ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNO', data).subscribe(response => {
      this.page.data = response;
    
      if (this.page.data.result !== 'pass'){
        this.page.loading = false;
        hideWait();
      } else {
        this.getNotes(this.srch);
      }
    });
  }

  newNote() {
    this.router.navigate(['/uniforms/newnote/' + this.page.rfno]);
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getNotes(this.srch);
  }

  onPageChange(event: number) {
    this.p = event
    this.getNotes(this.srch);
  }
}
