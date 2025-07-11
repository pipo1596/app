import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-images',
  standalone: false,
  templateUrl: './images.component.html',
  styleUrl: './images.component.css'
})
export class ImagesComponent {
  page = new Page();
  drop = false;

  //Input
  img = "";

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
    localStorage.clear();
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getImages(this.img);
  }

  getImages(srch: string){
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      img: this.img,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMIMG', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.total) this.total = this.page.data.total;
      if (this.page.data?.images) this.page.data.images = this.page.data.images.sort((a: any,b: any) => a.iono.localeCompare(b.iono))
      this.page.loading = false;
      hideWait();
    });
  }

  newImage(){
    localStorage.clear();
    localStorage.setItem('partpg','/uniforms/images/' + this.page.rfno + '/')
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/newimage/' + this.page.rfno]);
  }

  viewImage(iono: any){
    let image = (<HTMLAnchorElement>document.getElementById('viewLink' + iono));
    image!.href = environment.apiurl + '/cgi/CGGLSRIOV?PMIONO=' + iono 
  }

  deleteImage(iono: any){
    showWait();
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      iono: iono
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMIMG', data).subscribe(response => {
      this.page.data = response;
      this.getImages(this.img);
    });
  }

  onItemChange(event: number){
    this.itemsPerPage = event
  }

  onPageChange(event: number) {
    this.p = event
  }
}
