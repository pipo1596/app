import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit} from '@angular/core';
import { Page} from '../../shared/textField';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-quick-add',
  standalone: false,
  templateUrl: './quick-add.component.html',
  styleUrl: './quick-add.component.css'
})
export class QuickAddComponent implements AfterViewInit {
  page = new Page();
  drop = false; // More Actions
  @ViewChildren('itemInput') itemInputs!: QueryList<ElementRef<HTMLInputElement>>;

  // Parms
  nhno:any
  nano:any
  styl:any // Inquiry Return Value
  p1:any // Input # for Inquiry
  p2:any // Cache
  errors = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
) { }

  ngAfterViewInit(): void {
    if(this.p1 && this.styl){
      if(this.p2){
        let cache = JSON.parse(this.p2)
        for(let i = 0; i < this.itemInputs.length; i++){
          this.itemInputs.toArray()[i].nativeElement.value = cache[i]
        }
      }

      if(this.chkInq()){
        this.itemInputs.toArray()[this.p1 - 1].nativeElement.value = this.styl
      } else this.errors = "Item " + this.styl + " already selected"
    }
  }

  ngOnInit(): void {
    // showWait();
    this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
      this.nano = params.get('nano')
      this.styl = params.get('styl')
    });

    if(localStorage.getItem('p1')) this.p1 = localStorage.getItem('p1')
    if(localStorage.getItem('p2')) this.p2 = localStorage.getItem('p2')
    localStorage.clear();
    this.getInfo();
  }

  getInfo(){
    showWait();
    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      nano: this.nano
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNAQ', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.title) this.page.title = this.page.data.title;
      if (this.page.data.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data.menu) this.page.menu = this.page.data.menu;
      hideWait();
      this.page.loading = false;
    });
  }

  assignStyles(){
    this.errors = "";
    let inputs = this.itemInputs.toArray()
    let items = []
    for (let i = 0; i < inputs.length; i++){
      if(inputs[i].nativeElement.value !== ''){
        items.push(inputs[i].nativeElement.value);
      }
    }

    if(items.length == 0){
      window.alert("Must enter at least one style");
      return;
    }

    showWait();
    let data = {
      mode: 'update',
      nhno: this.nhno,
      nano: this.nano,
      items: items
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNAQ', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;

      if(this.page.data?.result !== 'pass'){
        this.errors = this.page.data?.errors
        hideWait();
        this.page.loading = false; 
      } else {
        let category = {
          nano: this.nano,
          desc: this.page.data?.nadesc
        }
        localStorage.setItem('nano', JSON.stringify(category));
        localStorage.setItem('UP_AUTH','Y');
        this.router.navigate(['/uniforms/products/' + this.nhno])
      }

    });
  }

  chkInq(){
    let result = true;

    let inputs = this.itemInputs.toArray()
    let items = []
    for (let i = 0; i < inputs.length; i++){
      items.push(inputs[i].nativeElement.value);
    }
    if(items.includes(this.styl)) result = false;
    return result;
  }

  inqStyle(id: any){
    let inputs = this.itemInputs.toArray()
    let cache = []
    for (let i = 0; i < inputs.length; i++){
      cache.push(inputs[i].nativeElement.value);
    }

    localStorage.clear();
    localStorage.setItem('p1', id)
    localStorage.setItem('p2', JSON.stringify(cache))
    localStorage.setItem('partpg','/uniforms/quickadd/' + this.nhno + '/' + this.nano + '/')
    localStorage.setItem('menu','/cgi/APOELMIS?PAMODE=*INQ&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N')
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMIS'])
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/categories/' + this.nhno]);
  }
}
