import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { showWait, hideWait } from '../../shared/utils';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-import',
  standalone: false,
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent {
  filters: any;
  checkedImg: any[] = [];
  page = new Page();
  iono: any = "";
  desc: any = "";
  npno: any;
  accept: any;

  iofile: any;
  iofkey: any = "";
  file = new TextField("file", ["required"]);

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private layout: LayoutService
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('filters') !== 'undefined'){
      this.filters = localStorage.getItem('filters')
    }
    if(localStorage.getItem('checked')){
      this.checkedImg = localStorage.getItem('checked')?.split(',')!
    }
    localStorage.clear();
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.npno = params.get('npno');
    });

    if(this.npno){
      this.accept = '.gif,.jpeg,.jpg,.tif,.png,.bmp'
      this.iofile = 'FPOENP'
      this.iofkey = this.npno
    } else if(this.checkedImg){
      this.accept = '.gif,.jpeg,.jpg,.tif,.png,.bmp'
      this.iofile = 'FPOENP'
      this.iofkey = '***' + this.checkedImg.toString()
    } else {
      this.accept = '.txt,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.gif,.jpeg,.jpg,.tif,.png,.bmp,.dst,.msg,.html,.htm'
      this.iofile = 'FPOENH'
      this.iofkey = this.page.rfno
    }

    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRIMG', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.pgName) this.layout.setProgram(this.page.rfno, this.page.data.pgName);
      if (this.page.data?.title) this.layout.setTitle(this.page.data.title)
      if (this.page.data?.menu) this.layout.setMenu(this.page.data.menu)
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      hideWait();
      this.page.loading = false;
    });
  }

  validate(){
    let upload = (<HTMLInputElement>document.getElementById('inputGroupFile01')).value

    if(upload){
      showWait();
      this.uploadFile();
      this.goBack()
    } else {   
      window.alert("Please select a file before submitting.");
    }
  }

  uploadFile() {
    this.dataService.triggerChild('');
  }

  saveAfterFileUpload() {
    if(localStorage.getItem('iono')){
      this.iono = localStorage.getItem('iono');
      localStorage.clear();
    }

    hideWait();
    this.page.loading = false;
  }

  goBack(){
    localStorage.setItem('UP_AUTH','Y');
    if (this.filters) localStorage.setItem('filters', this.filters)
    if(this.npno) {
      this.router.navigate(['/uniforms/images/' + this.page.rfno + '/' + this.npno]);
    } else if(this.checkedImg.length > 0){
      this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
    } else this.router.navigate(['/uniforms/images/' + this.page.rfno]);

  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }

}
