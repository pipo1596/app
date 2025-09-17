import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mass-item',
  standalone: false,
  templateUrl: './mass-item.component.html',
  styleUrl: './mass-item.component.css'
})
export class MassItemComponent {
  page = new Page();
  drop = false;
  vedpo: any = "";
  vedpn: any = "";
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
    this.getInfo('');
  }

  getInfo(vedpo: any){
    // if(vedpo){
    //   this.errors = ''
    // }

    this.row = ''
    showWait()
    let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      vedpo: vedpo
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVIU', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
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
      let customization = this.page.data?.cstmzChk[x].npnpno;
      if(customization == group){
        let xtraIndex = this.page.data?.cstmzChk.findIndex((i: { n1no: any; }) => i.n1no === this.page.data?.cstmzChk[x].n1no)
        let data = {
          n1no: this.page.data?.cstmzChk[x].n1no,
          vasItem: this.page.data?.cstmzChk[x].vasItem,
          application: this.page.data?.cstmzChk[x].application,
          answer: this.page.data?.cstmzChkXtra[xtraIndex].answer 
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
      vedpo: this.vedpo,
      vedpn: this.vedpn,
      n1noArr: this.grpChecked
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRVIU', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      
      if (this.page.data.result == 'fail'){
        this.errors = this.page.data.errors
      } else {
        this.errors = ''
        this.vedpo = ''
        this.vedpn = ''
      }
      this.grpChecked = [];
      this.getInfo(this.vedpo);
    });
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }
}
