import { Component } from '@angular/core';
import { Page, TextField } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data-trigger.service';
import { showWait, hideWait } from '../../shared/utils';

@Component({
  selector: 'app-import',
  standalone: false,
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent {
  page = new Page();
  iono: any = "";
  desc: any = "";
  accept = '.txt,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.gif,.jpeg,.jpg,.tif,.png,.bmp,.dst,.msg,.html,.htm'
  file = new TextField("file", ["required"]);

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    showWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });

    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRIO', data).subscribe(response => {
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
    this.router.navigate(['/uniforms/images/' + this.page.rfno]);
  }

}
