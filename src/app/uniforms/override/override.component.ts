import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';

@Component({
  selector: 'app-override',
  standalone: false,
  templateUrl: './override.component.html',
  styleUrl: './override.component.css'
})

export class OverrideComponent {
  page = new Page();
  drop = false; // More Actions
  errors: any;

  // Parms
  nhno: any;
  nino: any;
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
  rstr: any = "";
  h1sc: any = "";
  sdsc: any = "";
  ldsc: any = "";
  fimf: any = "";
  mimf: any = "";
  timf: any = "";
  zimf: any = "";
  mima: any = "";
  opcp: any = "";

  editorConfig: AngularEditorConfig = {
    editable: true,
    height: 'auto',
    minHeight: '150px',
    maxHeight: '500px'
  }


  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
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
    this.getOverride();
  }

  getOverride(){
    showWait();
      let data = {
        mode: 'getInfo',
        nhno: this.page.rfno,
        nino: this.nino,
        opv1: this.opv1,
        opv2: this.opv2,
        opv3: this.opv3,
        opv4: this.opv4,
        opv5: this.opv5
      }
      
      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRIW', data).subscribe(response => {
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
        if (this.page.data?.info?.rstr) this.rstr = this.page.data?.info?.rstr
        if (this.page.data?.info?.h1sc) this.h1sc = this.page.data?.info?.h1sc
        if (this.page.data?.info?.sdsc) this.sdsc = this.page.data?.info?.sdsc
        if (this.page.data?.info?.fimf) this.fimf = this.page.data?.info?.fimf
        if (this.page.data?.info?.mimf) this.mimf = this.page.data?.info?.mimf
        if (this.page.data?.info?.timf) this.timf = this.page.data?.info?.timf
        if (this.page.data?.info?.zimf) this.zimf = this.page.data?.info?.zimf
        if (this.page.data?.mima) this.mima = this.page.data?.mima
        if (this.page.data?.ldsc) this.ldsc = this.page.data?.ldsc
        if (this.page.data?.opcp) this.opcp = this.page.data?.opcp
        if (this.page.data?.info?.upct) this.upct = this.page.data?.info?.upct
        this.page.loading = false;
        hideWait();
      });
  }

  loadOverride(){
    showWait();
    this.errors = '';
      let data = {
        mode: 'update',
        nhno: this.page.rfno,
        nino: this.nino,
        opv1: this.opv1,
        opv2: this.opv2,
        opv3: this.opv3,
        opv4: this.opv4,
        opv5: this.opv5,
        rstr: this.rstr,
        h1sc: this.h1sc,
        sdsc: this.sdsc,
        fimf: this.fimf,
        mimf: this.mimf,
        timf: this.timf,
        zimf: this.zimf,
        mima: this.mima,
        ldsc: this.ldsc,
        opcp: this.opcp,
        upct: this.upct
      }

      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRIW', data).subscribe(response => {
        if (this.page.data?.result == 'pass'){
          localStorage.setItem('UP_AUTH','Y');
          this.goBack();
        } else {
          this.errors = this.page.data?.errors;
          // this.getOverride();
        }
        this.page.loading = false;
        hideWait();
      });
  }

  dltOverride(){
    showWait();
    this.errors = '';
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      nino: this.nino,
      opv1: this.opv1,
      opv2: this.opv2,
      opv3: this.opv3,
      opv4: this.opv4,
      opv5: this.opv5
    }
    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRIW', data).subscribe(response => {
      if (this.page.data?.result == 'pass'){
        localStorage.setItem('UP_AUTH','Y');
        this.goBack();
      } else {
        this.errors = this.page.data?.errors;
        // this.getOverride();
      }
      this.page.loading = false;
      hideWait();
    });
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

  preload(){
    if(confirm("This will overwrite all the existing fields, are you sure you want to continue?")){
    }
  }

  viewImage(img: any, fld: any){
    let image = (<HTMLAnchorElement>document.getElementById('view' + fld));
    image!.href = environment.apiurl + '/photos/styles/' + img 
  }

  goUpload(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/modalimf/' + this.page.rfno + '/' + this.nino]);
  }

  goAdditional(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(
      ['/uniforms/itemimages/' + this.page.rfno + '/' + this.nino],
      { queryParams: { opv1: this.opv1, opv2: this.opv2, opv3: this.opv3, opv4: this.opv4, opv5: this.opv5 } }
    );
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/overrides/' + this.page.rfno + '/' + this.nino]);
  }
}
