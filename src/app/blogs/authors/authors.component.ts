import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { convertToTimestamp, hideWait, openModal, scrollToTopInstant, showToast, showWait, timeAgo } from '../../shared/utils';

@Component({
  selector: 'app-authors',
  standalone: false,

  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})
export class AuthorsComponent {
  search = "";
  pvsearch = "";
  showList = false;

  imgprfx = environment.imgprfx;

  page = new Page();

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {

    let data = {
      mode: 'SEARCH'
    }

    this.http.post(environment.apiurl + '/cgi/APPLMAUTOR', data).subscribe(response => {

      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      this.page.loading = false;
      scrollToTopInstant();
      hideWait();
    });
  }

  encodedurl(url: string) {
    return encodeURI(url);
  }



  StartEntry() {
    this.router.navigate(['/blogs/newauthor']);
  }

  EditAuthor(bano: string) {
    this.router.navigate(['/blogs/editauthor/' + bano]);
  }
  startDelete(bano: string) {
    this.page.rfno = bano;
    openModal('deleteAuthor');

  }

  lastUpdate(author: any) {
    let lastdate = "0";
    let lasttime = "0";
    if (author.addt !== "0") {
      lastdate = author.addt;
      lasttime = author.adtm;

    }
    if (author.lsdt !== "0") {
      lastdate = author.lsdt;
      lasttime = author.lstm;
    }
    if (lastdate !== "0")
      return timeAgo(convertToTimestamp(lastdate, lasttime));
    else
      return "";
  }

  Search(force?: boolean) {
    force = force ?? false;
    if (!force && this.search == this.pvsearch) return;

    showWait();

    let data = {
      mode: 'SEARCH',
      search: this.search
    }
    this.pvsearch = this.search;
    this.http.post(environment.apiurl + '/cgi/APPLMAUTOR', data).subscribe(response => {
      this.page.data = response;
      scrollToTopInstant();
      hideWait();
    });
  }

  newAuthor() {
    this.router.navigate(['/blogs/newauthor']);
  }

  onDelete() {

    let data = {
      mode: 'DELETE',
      bano: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPLMAUTOR', data).subscribe(response => {
      showToast();

      this.Search(true);
    });
  }

}
