import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { showWait, hideWait } from '../../shared/utils';

@Component({
  selector: 'app-vas-question',
  standalone: false,
  templateUrl: './vas-question.component.html',
  styleUrl: './vas-question.component.css'
})
export class VasQuestionComponent {
  page = new Page();
  errors: any;
  application: any;
  npno: any;
  n2no: any;
  type: any;

  //Input
  vhno: any;
  desc: any;
  dfan: any;
  pdfan: any;
  dflk: any;
  force: any;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('vasApp')){
      this.application = JSON.parse(localStorage.getItem('vasApp')!);
    }
    localStorage.clear();
    console.log(this.application);
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.npno = params.get('npno');
      this.vhno = params.get('vhno');
    });
    this.getQuestion();
  }

  getQuestion(){
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      npno: this.npno,
      n1no: this.application.n1no, 
      n2no: this.application.n2no,
      v1cd: this.application.v1cd,
      v2no: this.application.v2no 
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV2', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.info.nv2type) this.type = this.page.data.info.nv2type;
      if (this.page.data?.info.desc) this.desc = this.page.data.info.desc
      if (this.page.data?.seqDrop){
        this.page.data.seqDrop = this.page.data.seqDrop.sort((a: any, b: any) => a.value.localeCompare(b.value));
      }
      hideWait();
      this.page.loading = false;
    });
  }

  loadQuestion(){
    let data = {
      mode: 'update',
      nhno: this.page.rfno,
      n2no: this.n2no,
      desc: '',
      dfan: '',
      dfanParent: '',
      dfanLocked: '',
      force: ''
    }

    // this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV2', data).subscribe(response => {
    //   this.page.data = response;
    //   if (this.page.data.title) this.page.title = this.page.data.title;
    //   if (this.page.data.menu) this.page.menu = this.page.data.menu;
      // hideWait();
    //   this.page.loading = false;
    // });
  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  inqDrop() {
    let menu = '/cgi/APOELMVH?PAMODE=*INQ&PMV1CD=' + this.application.v1cd + '&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N'
    localStorage.clear();
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('partpg','/uniforms/vasquestion/' + this.page.rfno + '/' + this.npno);
    localStorage.setItem('menu',menu);
    this.router.navigate(['/uniforms/iframe/APOELMVH']);
  }

  goBack(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/vasapplications/' + this.page.rfno + '/' + this.npno]);
  }

}
