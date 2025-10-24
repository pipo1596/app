import { Component} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait, convertToDate, formatDateUS } from '../../shared/utils';
import { AppQuestionsService } from '../../services/app-questions.service';

@Component({
  selector: 'app-vas-applications',
  standalone: false,
  templateUrl: './vas-applications.component.html',
  styleUrl: './vas-applications.component.css'
})

export class VasApplicationsComponent {
  page = new Page();
  allexpanded: boolean = false;
  expanded: any[] = [];

  // Input 
  npno: any;
  nino: any;
  vsmt: any;
  cache: any;
  p1: any;

  // Checkboxes
  checked: any[] = [];

  //Paging
  p: number = 1;
  itemsPerPage: number = 10;
  total: number = 0;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private questionService: AppQuestionsService,
  ) { }

  ngOnInit(): void {
    this.expanded = [];
    this.checked = [];
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.npno = params.get('npno');
      this.vsmt = params.get('vsmt');
    });
    if(localStorage.getItem('allexpand')){
      this.allexpanded = localStorage.getItem('allexpand') ? true : false;
    }
    if(localStorage.getItem('nino')){
      this.nino = localStorage.getItem('nino')
    }
    if(localStorage.getItem('cache')){
      this.cache = localStorage.getItem('cache')
    }
    if(localStorage.getItem('p1')){
      this.p1 = JSON.parse(localStorage.getItem('p1')!);
    }

    this.getCustomizations()
    
    localStorage.clear();
  }

  getCustomizations() {
    if(this.questionService.getPage()){
      this.p = this.questionService.getPage();
    }

    if(this.questionService.getItems()){
      this.itemsPerPage = this.questionService.getItems();
    }

     let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      npno: this.npno,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNV1', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      if (this.page.data.total) this.total = this.page.data.total;
      if (this.p1?.expanded){
        this.expanded = this.p1.expanded
      }
      if (this.allexpanded) this.expandAll();
      this.page.loading = false;
      hideWait();
    });
  }

  hasQuestions(): boolean {
    for (let i = 0; i < this.page.data?.applications?.length; i++) {
      if (this.page.data?.applications[i].bttn == 'Y') return true;
    } return false;
  }
  
  chkExpanded(application: any){
    for (let i = 0; i < this.expanded.length; i++) {
      let expand = this.expanded[i]
      if (JSON.stringify(expand) == JSON.stringify(application)) return true;
    } return false;
  }

  expandApplication(application: any){

    if(this.chkExpanded(application)){
      for(let i = 0; i < this.expanded.length; i++){
        if(JSON.stringify(this.expanded[i]) == JSON.stringify(application)){
          this.expanded.splice(i,1)
        }
      }
      // this.expanded.splice(this.expanded.indexOf(application),1)
      this.questionService.clrApp(application)
      this.allexpanded = false;
    } else{
      this.expanded.push(application)
      this.questionService.setApp(application)
      this.allexpanded = true;

      for(let i = 0; i < this.page.data?.applications.length; i++){
        if(this.page.data?.applications[i].bttn == 'Y' && !this.chkExpanded(this.page.data?.applications[i])) {
          this.allexpanded = false
        }
      }
    }
  }

  expandAll(){
    this.questionService.clrAll();
    for (let i = 0; i < this.page.data?.applications.length; i++) {
      let application = this.page.data?.applications[i]
      if(application.bttn == 'Y'){
        if(this.allexpanded && !this.chkExpanded(application)){
          this.expanded.push(application)
          this.questionService.setApp(application)
        } else if(!this.allexpanded && this.chkExpanded(application)){

          for(let y = 0; y < this.expanded.length; y++){
            if (JSON.stringify(this.expanded[y]) == JSON.stringify(application)){
              this.expanded.splice(y,1)
            }
          }

        }
      }
    }
  }

  loadApplication(mode: any, n1no: any){
    localStorage.setItem('UP_AUTH','Y');
    switch(mode){
      case 'new':
        if(this.nino) localStorage.setItem('nino',this.nino)
        this.router.navigate(['/uniforms/newvasapplication/' + this.page.rfno + '/' + this.npno]);
        break;
      case 'edit':
        this.router.navigate(['/uniforms/vasapplication/' + this.page.rfno + '/' + this.npno + '/' + n1no]);
        break;
      case 'copy':
        showWait();
        let data = {
          mode: 'copy',
          nhno: this.page.rfno,
          npno: this.npno,
          n1no: n1no
        }
        this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
          this.page.data = response;

          if (this.page.data.result != 'pass'){
            this.page.loading = false;
            hideWait();
          } else {
            this.getCustomizations();
          }
        });
        break;
    }
  }

  deleteApplication(n1no: string){
    showWait();
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      npno: this.npno,
      n1no: n1no
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV1', data).subscribe(response => {
      this.page.data = response;

      if (this.page.data.result != 'pass'){
        this.page.loading = false;
        hideWait();
      } else {
        this.getCustomizations();
      }
    });
  }

  allChecked(){
    for (let i = 0; i < this.page.data?.applications?.length; i++) {
      if(!(this.isChecked(this.page.data.applications[i]))){
        return false;
      }
    } return true;
  }

  isChecked(application: any){
    return this.checked.some(function(el){ return el.n1no === application.n1no})
  }

  checkAll() {
    var all = this.allChecked()
    for (let i = 0; i < this.page.data?.applications.length; i++) {
      if (!all && !this.isChecked(this.page.data?.applications[i]) ||
           all && this.isChecked(this.page.data?.applications[i])) {
        this.checkApplication(this.page.data?.applications[i])
      }
    }
  }

  checkApplication(application: any) {
    if(this.isChecked(application)) {
      let index = this.checked.findIndex(x => x.n1no === application.n1no)
      this.checked.splice(index,1)
    } else {
      this.checked.push(application);
      this.checked.sort();
    }    
  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('rtpg', this.page.data?.npname);
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }

  goProduct() {
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('cache',this.cache);
    this.router.navigate(['/uniforms/product/' + this.page.rfno + '/' + this.nino]);
  }

  dsppbdate(date:any){
      return formatDateUS(new Date(convertToDate(date)));
  }

  onItemChange(event: number){
    showWait();
    this.itemsPerPage = event
    this.questionService.setConfig(this.p, this.itemsPerPage);
    this.getCustomizations()
    this.expanded = []
  }

  onPageChange(event: number) {
    showWait();
    this.p = event
    this.questionService.setConfig(this.p, this.itemsPerPage);
    this.getCustomizations()
    this.expanded = []
  }

}
