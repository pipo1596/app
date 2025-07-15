import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-mass-app',
  standalone: false,
  templateUrl: './mass-app.component.html',
  styleUrl: './mass-app.component.css'
})
export class MassAppComponent {
  page = new Page();
  drop = false;
  v1cd: any = "";
  v2no: any = "";
  desc: any = "";
  applications: any = [];
  groups: any = [];
  grpChecked: any = [];
  errors: any;
  row: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.getInfo();
  }

  getInfo(){
    this.row = ''
    showWait()
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      v1cd: this.v1cd
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVA', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data?.appDrp) this.applications = this.page.data.appDrp;
      if (this.page.data?.cstmzChk){ 
        this.groups = this.page.data.cstmzChk;
        for (let x = 0; x < this.page.data?.cstmzChk.length; x++) {
          this.grpChecked.push(this.page.data.cstmzChk[x].n1no)
        }
      }
      this.page.loading = false;
      hideWait();
    });
  }

  isRow(group: any, index: any){
    if(!this.row || this.row !== group || index == 0){
      this.row = group
      return true
    } else return false;

  }

  isChecked(group: any){
    if (this.grpChecked.indexOf(group) !== -1){
      return true;
    } else return false;
  }

  buildApps(group: any){
    let apps: any = []
    for (let x = 0; x < this.page.data?.cstmzChk.length; x++) {
      let customization = this.page.data?.cstmzChk[x].npDesc;
      if(customization == group){
        let data = {
          n1no: this.page.data?.cstmzChk[x].n1no,
          nv1Desc: this.page.data?.cstmzChk[x].nv1Desc
        }
        apps.push(data);
      }
    } 
    return apps;
  }

  checkGroup(group: any){
    if(this.isChecked(group)){
      this.grpChecked.splice(this.grpChecked.indexOf(group),1)
    } else {
      this.grpChecked.push(group)
    }
  }

  allChecked(){
    for (let x = 0; x < this.page.data?.cstmzChk.length; x++) {
      if(!(this.isChecked(this.page.data?.cstmzChk[x].n1no))){
        return false;
      }
    } return true;
  }

  checkAll(){
    var all = this.allChecked()
    for (let i = 0; i < this.page.data?.cstmzChk.length; i++) {
      if (!all && !this.isChecked(this.page.data?.cstmzChk[i].n1no) ||
           all && this.isChecked(this.page.data?.cstmzChk[i].n1no)) {
        this.checkGroup(this.page.data?.cstmzChk[i].n1no)
      }
    }
  }

  loadUpdate(){
    showWait()
    let data = {
      mode: 'update',
      nhno: this.page.rfno,
      v1cd: this.v1cd,
      desc: this.desc,
      n1noArr: this.grpChecked
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVA', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.result == 'fail'){
        this.errors = this.page.data.errors
      } else this.errors = ''
      this.desc = ''
      this.grpChecked = [];
      this.getInfo();
    });
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }
}
