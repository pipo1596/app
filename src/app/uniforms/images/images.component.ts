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
  npno: any;

  //Paging
  p: number = 1;
  itemsPerPage: number = 10;
  total: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    localStorage.clear();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.npno = params.get('npno');
    });
    this.getImages(this.img);
  }

  getImages(srch: string){
    showWait();
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      npno: this.npno,
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
      if (this.page.data?.seqDrop) this.page.data.seqDrop = this.page.data.seqDrop.sort((a: any,b: any) => a.seq.localeCompare(b.seq))
      if (this.npno) this.formatTips()
      this.page.loading = false;
      hideWait();
    });
  }

  formatTips(){
    for (let i = 0; i < this.page.data?.images.length; i++) {
      if(this.page.data.images[i].addt){
        this.page.data.images[i].addt = this.page.data.images[i].addt.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
      }
      if(this.page.data.images[i].adtm){
        this.page.data.images[i].adtm = this.page.data.images[i].adtm.replace(/(\d{2})(\d{2})(\d{2})/, "$1:$2:$3");
      }
    }
  }

  newImage(){
    localStorage.clear();
    localStorage.setItem('UP_AUTH','Y');
    if(this.npno){
      this.router.navigate(['/uniforms/image/' + this.page.rfno + '/' + this.npno]);
    } else this.router.navigate(['/uniforms/image/' + this.page.rfno]);

  }

  saveSeq(){
    for (let i = 0; i < this.page.data?.images.length; i++) {
      let image = this.page.data?.images[i]
      let data = {
        mode: 'saveSeq',
        nhno: this.page.rfno,
        iono: image.iono,
        seq: (<HTMLInputElement>document.getElementById('seq' + image.iono)).value
      }

      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRIMG', data).subscribe(response => {
        this.page.data = response;
        this.getImages('');
      });
    }
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
