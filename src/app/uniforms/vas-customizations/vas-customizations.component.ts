import { Component} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait, convertToDate, formatDateUS } from '../../shared/utils';

@Component({
  selector: 'app-vas-customizations',
  standalone: false,
  templateUrl: './vas-customizations.component.html',
  styleUrl: './vas-customizations.component.css'
})

export class VasCustomizationsComponent {
  page = new Page();
  drop = false; // More Actions
  expanded: any[] = [];

  // Input 
  npno: any;

  // Checkboxes
  checked: any[] = [];

  //Paging
  p: number = 1;
  itemsPerPage: number = 10;
  total: number = 0;

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this.checked = [];
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
      this.npno = params.get('npno');
    });
    this.getCustomizations()
  }

  getCustomizations() {
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
      this.page.loading = false;
      hideWait();
    });
  }

  loadCustomization(mode: any, n1no: any){
    localStorage.setItem('UP_AUTH','Y');
    switch(mode){
      case 'new':
        this.router.navigate(['/uniforms/vascustomization/' + this.page.rfno + '/' + this.npno]);
        break;
      case 'edit':
        this.router.navigate(['/uniforms/vascustomization/' + this.page.rfno + '/' + this.npno + '/' + n1no]);
        break;
      case 'copy':
        localStorage.setItem('copy', n1no)
        this.router.navigate(['/uniforms/vascustomization/' + this.page.rfno + '/' + this.npno + '/' + n1no]);
        break;
    }
  }

  deleteCustomization(n1no: string){
    showWait();
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      npno: this.npno,
      n1no: n1no
    }

    // this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNI', data).subscribe(response => {
    //   this.page.data = response;

    //   if (this.page.data.result != 'pass'){
    //     this.page.loading = false;
    //     hideWait();
    //   } else {
    //     this.getCustomizations();
    //   }
    // });
  }

  allChecked(){
    for (let i = 0; i < this.page.data?.applications.length; i++) {
      if(!(this.isChecked(this.page.data.applications[i]))){
        return false;
      }
    } return true;
  }

  isChecked(application: any){
    return this.checked.some(function(el){ return el.n1no === application.n1no})
  }

  checkAll() {
    for (let i = 0; i < this.page.data.applications.length; i++) {
      this.checkCustomization(this.page.data.applications[i])
    }
  }

  checkCustomization(application: any) {
    if(this.isChecked(application)) {
      let index = this.checked.findIndex(x => x.npno === application.n1no)
      this.checked.splice(index,1)
    } else {
      this.checked.push(application);
      this.checked.sort();
    }    
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/customizations/' + this.page.rfno]);
  }

  dsppbdate(date:any){
      return formatDateUS(new Date(convertToDate(date)));
  }

  onItemChange(event: number){
    showWait();
    this.itemsPerPage = event
    this.getCustomizations()
  }

  onPageChange(event: number) {
    showWait();
    this.p = event
    this.getCustomizations()
  }

}
