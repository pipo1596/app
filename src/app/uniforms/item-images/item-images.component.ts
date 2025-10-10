import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-item-images',
  standalone: false,
  templateUrl: './item-images.component.html',
  styleUrl: './item-images.component.css'
})
export class ItemImagesComponent {
  page = new Page();
  drop = false;
  errors: any;

  //Parms
  nino: any;

  //Input
  opv1: any = "";
  opv2: any = "";
  opv3: any = "";
  opv4: any = "";
  opv5: any = "";
  options: any = "";

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
    hideWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.nino = params.get('nino');
    });
    this.route.queryParamMap.subscribe(params => {
      this.opv1 = params.get('opv1');
      this.opv2 = params.get('opv2');
      this.opv3 = params.get('opv3');
      this.opv4 = params.get('opv4');
      this.opv5 = params.get('opv5');
    });
    this.getImages();
  }

  getImages() {
    showWait();
      let data = {
        mode: 'getInfo',
        nhno: this.page.rfno,
        nino: this.nino,
        itemsPerPage: this.itemsPerPage,
        currentPage: this.p
      }
      
      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMII', data).subscribe(response => {
        this.page.data = response;
        if (this.page.data.title) this.page.title = this.page.data.title;
        if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
        if (this.page.data.menu) this.page.menu = this.page.data.menu;
        if (this.page.data.total) this.total = this.page.data.total;
        if (this.page.data?.style?.opd1){
          this.options += (this.page.data?.style?.opd1 + ': ' + (this.page.data?.style?.opv1 ? this.page.data?.style?.opv1 : '<all>') + '   ')
        }
        if (this.page.data?.style?.opd2){
          this.options += (this.page.data?.style?.opd2 + ': ' + (this.page.data?.style?.opv1 ? this.page.data?.style?.opv1 : '<all>') + '   ')
        }
        if (this.page.data?.style?.opd3){
          this.options += (this.page.data?.style?.opd3 + ': ' + (this.page.data?.style?.opv1 ? this.page.data?.style?.opv1 : '<all>') + '   ')
        }
        if (this.page.data?.style?.opd4){
          this.options += (this.page.data?.style?.opd4 + ': ' + (this.page.data?.style?.opv1 ? this.page.data?.style?.opv1 : '<all>') + '   ')
        }
        if (this.page.data?.style?.opd5){
          this.options += (this.page.data?.style?.opd5 + ': ' + (this.page.data?.style?.opv1 ? this.page.data?.style?.opv1 : '<all>') + '   ')
        }
        this.page.loading = false;
        hideWait();
      });
  }

  addImage(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(
      ['/uniforms/itemimage/' + this.page.rfno + '/' + this.nino],
      { queryParams: { opv1: this.opv1, opv2: this.opv2, opv3: this.opv3, opv4: this.opv4, opv5: this.opv5 } }
    );  
  }

  editImage(image: any){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(
      ['/uniforms/itemimage/' + this.page.rfno + '/' + this.nino + '/' + image.iino],
      { queryParams: { opv1: this.opv1, opv2: this.opv2, opv3: this.opv3, opv4: this.opv4, opv5: this.opv5 } }
    );
  }

  deleteImage(image: any){
    showWait();
    this.errors = ''

    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      iino: image.iino
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRII', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.result !== 'pass') this.errors = this.page.data?.errors
      this.getImages();
    });
  }

  onItemChange(event: number){
    this.itemsPerPage = event
    this.getImages();
  }

  onPageChange(event: number) {
    this.p = event
    this.getImages();
  }

  goBack(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(
      ['/uniforms/override/' + this.page.rfno + '/' + this.nino],
      { queryParams: { opv1: this.opv1, opv2: this.opv2, opv3: this.opv3, opv4: this.opv4, opv5: this.opv5 } }
    );
  }
}
