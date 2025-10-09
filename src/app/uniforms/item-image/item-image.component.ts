import { Component } from '@angular/core';
import { Page} from '../../shared/textField';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-item-image',
  standalone: false,
  templateUrl: './item-image.component.html',
  styleUrl: './item-image.component.css'
})

export class ItemImageComponent {
  page = new Page();
  errors: any;

  // Parms
  nhno: any;
  nino: any;
  iino: any;
  upct = "0";

  // Display
  popup = ""
  opv1: any;
  opv2: any;
  opv3: any;
  opv4: any;
  opv5: any;
  options: any = "";

  // Input
  fimf: any;
  mimf: any;
  timf: any;
  zimf: any;
  alt: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.setMode();
    this.getImage();
  }

  getImage(){
    showWait();
    let data = {
        mode: 'getInfo',
        nhno: this.nhno,
        nino: this.nino,
        iino: this.iino,
        opv1: this.opv1,
        opv2: this.opv2,
        opv3: this.opv3,
        opv4: this.opv4,
        opv5: this.opv5
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRII', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.style?.opd1){
        this.options += (this.page.data?.style?.opd1 + ': ' + this.page.data?.style?.opv1 + '   ')
      }
      if (this.page.data?.style?.opd2){
        this.options += (this.page.data?.style?.opd2 + ': ' + this.page.data?.style?.opv2 + '   ')
      }
      if (this.page.data?.style?.opd3){
        this.options += (this.page.data?.style?.opd3 + ': ' + this.page.data?.style?.opv3 + '   ')
      }
      if (this.page.data?.style?.opd4){
        this.options += (this.page.data?.style?.opd4 + ': ' + this.page.data?.style?.opv4 + '   ')
      }
      if (this.page.data?.style?.opd5){
        this.options += (this.page.data?.style?.opd5 + ': ' + this.page.data?.style?.opv5 + '   ')
      }
      if (this.page.data?.upct) this.upct = this.page.data?.upct;
      if (this.page.data?.info?.fimf) this.fimf = this.page.data?.info?.fimf
      if (this.page.data?.info?.mimf) this.mimf = this.page.data?.info?.mimf
      if (this.page.data?.info?.timf) this.timf = this.page.data?.info?.timf
      if (this.page.data?.info?.zimf) this.zimf = this.page.data?.info?.zimf
      if (this.page.data?.info?.alt) this.alt = this.page.data?.info?.alt
      this.page.loading = false;
      hideWait();
    });
  }

  setMode() {
    localStorage.clear();
    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.nino = params.get('nino')
      this.iino = params.get('iino')
    });

    this.route.queryParamMap.subscribe(params => {
      this.opv1 = params.get('opv1');
      this.opv2 = params.get('opv2');
      this.opv3 = params.get('opv3');
      this.opv4 = params.get('opv4');
      this.opv5 = params.get('opv5');
    });

    if (this.iino) {
      this.page.editmode = true;
      this.page.entrymode = false;
    } else { 
      this.page.entrymode = true;
      this.page.editmode = false;
    }

  }

  viewImage(img: any, fld: any){
    let image = (<HTMLAnchorElement>document.getElementById('view' + fld));
    image!.href = environment.apiurl + '/photos/styles/' + img 
  }


  chkImg(mode: any){
    let valid = false;
    switch(mode){
      case 'fimf':
        if(this.fimf || this.page.data?.info?.fimf) valid = true;
        break;
      case 'mimf':
        if(this.mimf || this.page.data?.info?.mimf) valid = true;
        break;
      case 'timf':
        if(this.timf || this.page.data?.info?.timf) valid = true;
        break;
      case 'zimf':
        if(this.zimf || this.page.data?.info?.zimf) valid = true;
        break;
    }
    return valid;
  }

  loadImf(event: any){
    let imf = JSON.parse(event)
    switch(imf.mode){
      case 'fimf':
        this.fimf = imf.file
        break;
      case 'mimf':
        this.mimf = imf.file
        break;
      case 'mimf':
        this.mimf = imf.file
        break;
      case 'timf':
        this.timf = imf.file
        break;
      case 'zimf':
        this.zimf = imf.file
        break;
    }
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(
      ['/uniforms/itemimages/' + this.nhno+ '/' + this.nino],
      { queryParams: { opv1: this.opv1, opv2: this.opv2, opv3: this.opv3, opv4: this.opv4, opv5: this.opv5 } }
    );
  }

  loadImage(mode: string){
    showWait();
    this.errors = ""
    let data = {
      mode: mode,
      nhno: this.nhno,
      nino: this.nino,
      iino: this.iino,
      opv1: this.opv1,
      opv2: this.opv2,
      opv3: this.opv3,
      opv4: this.opv4,
      opv5: this.opv5,
      fimf: this.fimf,
      mimf: this.mimf,
      timf: this.timf,
      zimf: this.zimf,
      alt: this.alt,
      upct: this.upct
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRII', data).subscribe(response => {
      this.page.data = response;

      if (this.page.data?.result == 'pass'){
        localStorage.setItem('UP_AUTH','Y');
        this.router.navigate(
          ['/uniforms/itemimages/' + this.nhno + '/' + this.nino],
          { queryParams: { opv1: this.opv1, opv2: this.opv2, opv3: this.opv3, opv4: this.opv4, opv5: this.opv5 } }
        );
      } else {
        this.errors = this.page.data?.errors;
        // this.getImage();
      }
      this.page.loading = false;
      hideWait();
    });
  }

  deleteImage(){
    showWait();

    let data = {
      mode: 'delete',
      nhno: this.nhno,
      iino: this.iino
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRII', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.result == 'pass') this.goBack();
      this.page.loading = false;
      hideWait();
    });
  }
}
