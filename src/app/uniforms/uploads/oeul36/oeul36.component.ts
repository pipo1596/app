import { Component } from '@angular/core';
import { Page, TextField } from '../../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data-trigger.service';
import { showWait, hideWait } from '../../../shared/utils';

@Component({
  selector: 'app-oeul36',
  standalone: false,
  templateUrl: './oeul36.component.html',
  styleUrl: './oeul36.component.css'
})
export class OEUL36Component {
  page = new Page();
  ulid: any = "";
  iono: any = "";
  accept = '.txt'
  email: any = "";
  file = new TextField("file", ["required"]);

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.ulid = params.get('ulid');
    });

    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPUL36', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      hideWait();
      this.page.loading = false;
    });
  }

  validate(){
    let upload = (<HTMLInputElement>document.getElementById('inputGroupFile01')).value

    if(upload){
      showWait();
      this.uploadFile();
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

  processFile(){
    showWait();
    let data = {
      mode: 'update',
      nhno: this.page.rfno,
      iono: this.iono,
      email: this.email
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPUL36', data).subscribe(response => {
      this.page.data = response;
      if(this.page.data.result == 'pass'){
        (<HTMLInputElement>document.getElementById('inputGroupFile01')).value = '';
        this.iono = ''
      }
      hideWait();
      this.page.loading = false;
    });
  }

  discardFile(){
    if(!this.iono){
      window.alert("Please upload a file before discarding.");
      return
    }

    showWait();
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      iono: this.iono
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPUL36', data).subscribe(response => {
      this.page.data = response;
      (<HTMLInputElement>document.getElementById('inputGroupFile01')).value = '';
      this.iono = ''
      this.page.loading = false;
      hideWait();
    });
  }

  goBack(){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/import/' + this.page.rfno]);
  }

}
