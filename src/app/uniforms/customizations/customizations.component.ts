import { Component} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-customizations',
  standalone: false,
  templateUrl: './customizations.component.html',
  styleUrl: './customizations.component.css'
})

export class CustomizationsComponent {
  exp: any;
  page = new Page();
  drop = false; // More Actions

  //Filter
  name: any;
  npno: any;
  rtpg: any;
  vitem: any;
  lvl: any;
  app: any;
  img: any = "";
  styl: any;
  vfg: any;
  ctno: any;
  lsdt: any;
  lsdtUsa: any;
  filters: any;

  //Checkboxes
  checked: any[] = [];
  checkedImg: any[] = [];
  assigned: any[] = [];

  //Paging
  p: number = 1;
  itemsPerPage: number = 50;
  total: number = 0;
  offset = "0";

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('expanded')){
      this.exp = localStorage.getItem('expanded')
    }
    if(localStorage.getItem('filters')){
      this.filters = localStorage.getItem('filters')
    }
    if(localStorage.getItem('rtpg')) this.rtpg = localStorage.getItem('rtpg');
    if(localStorage.getItem('p2')) this.p = parseInt(localStorage.getItem('p2')!);
    localStorage.clear();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    if(this.filters && this.filters !== 'undefined'){
      let filtObj = JSON.parse(this.filters)
      this.name = filtObj.name
      this.vitem = filtObj.item
      this.app = filtObj.app
      this.img = filtObj.img
      this.npno = filtObj.number
      this.lvl = filtObj.items
      this.styl = filtObj.style
      this.vfg = filtObj.template
      this.ctno = filtObj.category
    }
    this.getCustomizations('')

  }

  // For discontinued mass update functions
  // loadMassAction(action: any){
  //   localStorage.setItem('UP_AUTH','Y')
  //   this.router.navigate(['/uniforms/mass' + action + '/' + this.page.rfno]);
  // }

  loadAction(action: any){
    let filters = {
      'name': this.name,
      'item': this.vitem,
      'app': this.app,
      'img': this.img,
      'number': this.npno,
      'items': this.lvl,
      'style': this.styl,
      'template': this.vfg,
      'category': this.ctno
    }
    localStorage.setItem('filters', JSON.stringify(filters))
    localStorage.setItem('UP_AUTH','Y')
    localStorage.setItem('expanded',this.exp)
    this.router.navigate(['/uniforms/massapp' + action + '/' + this.page.rfno]);
  }

  trim(value: any){
    return value.replace(/^0+/, '')
  }

  getCustomizations(mode: any) {
    showWait();
    if(mode == 'search') this.p = 1;
     let data = {
      mode: 'getInfo',
      nhno: this.page.rfno,
      name: this.name,
      npno: this.npno,
      item: this.vitem?.vedp,
      lvl: this.lvl?.valu,
      app: this.app?.v1cd,
      img: this.img,
      style: this.styl?.styl,
      vfg: this.vfg?.vfgn,
      ctno: this.ctno?.ctno,
      lsdt: this.lsdtUsa,
      itemsPerPage: this.itemsPerPage,
      currentPage: this.p
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNP', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data?.title) this.page.title = this.page.data.title;
      if (this.page.data?.fullname) this.page.fullname = this.page.data.fullname;
      if (this.page.data?.menu) this.page.menu = this.page.data.menu;
      if (!this.rtpg && this.page.data?.customizations) this.page.data.customizations = this.page.data.customizations.sort((a: any,b: any) => a.npno.localeCompare(b.npno))
      if (this.page.data?.total) this.total = this.page.data.total

      if (this.page.data?.stylDrop){
        this.page.data.stylDrop = this.page.data.stylDrop.sort((a: any,b: any) => a.styl.localeCompare(b.styl))
        this.page.data.stylDrop.forEach((styl: any) => {
          styl.desc = styl.styl + ' - ' + styl.desc
        });
      }

      if (this.page.data?.apps){
        this.page.data.apps.forEach((app: any) => {
          app.desc = app.desc + ' - ' + app.v1cd
        });
      }

      if (this.page.data?.items){
        this.page.data.items.forEach((item: any) => {
          item.desc = item.desc !== '' ? item.sku + ' - ' + item.desc : item.sku
        });
      }

      if (this.page.data?.stylconfig){
        this.page.data.stylconfig.forEach((config: any) => {
          config.desc = config.desc + ' - ' + config.vfgn
        });
      }

      if (this.page.data?.levels){
        this.page.data.levels = this.page.data.levels.sort((a: any,b: any) => a.valu.localeCompare(b.valu))
      }

      if(this.page.data?.customizations && this.rtpg){
        let fromIndex = this.page.data?.customizations.findIndex((x: { name: any; }) => x.name === this.rtpg) //Get position in array
        if(fromIndex > 0){ //If not already first in array, move to first
        let element = this.page.data?.customizations.splice(fromIndex, 1);
        this.page.data?.customizations.splice(0, 0, element[0]);
        }
      }

      this.rtpg = '';
      if(localStorage.getItem('rtpg')) localStorage.setItem('rtpg','')
      this.page.loading = false;
      hideWait();
    });
  }

  loadCustomization(mode: any, npno: any){
    let filters = {
      'name': this.name,
      'item': this.vitem,
      'app': this.app,
      'img': this.img,
      'number': this.npno,
      'items': this.lvl,
      'style': this.styl,
      'template': this.vfg,
      'category': this.ctno
    }
    localStorage.setItem('filters', JSON.stringify(filters))
    localStorage.setItem('UP_AUTH','Y')
    localStorage.setItem('expanded',this.exp)
    localStorage.setItem('p2',JSON.stringify(this.page))
    switch(mode){
      case 'new':
        this.router.navigate(['/uniforms/newcustomization/' + this.page.rfno]);
        break;
      case 'edit':
        this.router.navigate(['/uniforms/customization/' + this.page.rfno + '/' + npno]);
        break;
      case 'copy':
        localStorage.setItem('copy',npno)
        this.router.navigate(['/uniforms/customization/' + this.page.rfno + '/' + npno]);
        break;
    }
  }

  validate(npno: string){
    if(confirm("Are you sure you want to delete this customization?")){
      this.deleteCustomization(npno)
    }
  }

  deleteCustomization(npno: string){
    showWait();
    let data = {
      mode: 'delete',
      nhno: this.page.rfno,
      npno: npno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNP', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.result != 'pass'){
        this.page.loading = false;
        hideWait();
      } else {
        this.getCustomizations('');
      }
    });
  }

  allChecked(){
    for (let i = 0; i < this.page.data?.customizations.length; i++) {
      if(!(this.isChecked(this.page.data.customizations[i]))){
        return false;
      }
    } return true;
  }

  allCheckedImg(){
    for (let i = 0; i < this.page.data?.customizations.length; i++) {
      if(!(this.isCheckedImg(this.page.data.customizations[i]))){
        return false;
      }
    } return true;
  }

  isChecked(customization: any){
    return this.checked.some(function(el){ return el.npno === customization.npno})
  }

  isCheckedImg(customization: any){
    return this.checkedImg.some(function(el){ return el.npno === customization.npno})
  }

  checkAll() {
    var all = this.allChecked()
    for (let i = 0; i < this.page.data.customizations.length; i++) {
      if (!all && !this.isChecked(this.page.data.customizations[i]) ||
           all && this.isChecked(this.page.data.customizations[i])) {
        this.checkCustomization(this.page.data.customizations[i])
      }
    }
  }

  checkAllImg(mode: any) {
    if(mode !== 'U'){
      var all = this.allCheckedImg()
      for (let i = 0; i < this.page.data.customizations.length; i++) {
        if (!all && !this.isCheckedImg(this.page.data.customizations[i]) ||
            all && this.isCheckedImg(this.page.data.customizations[i])) {
          this.checkImg(this.page.data.customizations[i])
        }
      }
    } else {
      for (let i = 0; i < this.page.data.customizations.length; i++) {
        if (this.isCheckedImg(this.page.data.customizations[i])) {
          this.checkImg(this.page.data.customizations[i])
        }
      }
    }
  }

  checkCustomization(customization: any) {
    let np = {
      npno: customization.npno,
      config: customization.vfgn
    }

    if(this.isChecked(np)) {
      let index = this.checked.findIndex(x => x.npno === np.npno)
      this.checked.splice(index,1)
    } else {
      this.checked = []
      this.checked.push(np);
      this.checked.sort();
    }    
  }

  checkImg(customization: any) {
    let np = {
      npno: customization.npno,
      config: customization.vfgn
    }

    if(this.isCheckedImg(np)) {
      let index = this.checkedImg.findIndex(x => x.npno === np.npno)
      this.checkedImg.splice(index,1)
    } else {
      this.checkedImg.push(np);
      this.checkedImg.sort();
    }    
  }

  assignStyles(){
    showWait()
    if(this.checked.length == 0){
      window.alert("Must select a customization to assign styles");
    } else{
      let filters = {
        'name': this.name,
        'item': this.vitem,
        'app': this.app,
        'img': this.img,
        'number': this.npno,
        'items': this.lvl,
        'style': this.styl,
        'template': this.vfg,
        'category': this.ctno
      }
      localStorage.setItem('npfilters', JSON.stringify(filters))
      localStorage.setItem('UP_AUTH','Y')
      localStorage.setItem('expanded',this.exp)
      let customizations = JSON.stringify(this.checked)
      localStorage.setItem('assign',customizations)
      this.router.navigate(['/uniforms/products/' + this.page.rfno]);
    }
    hideWait()
    this.page.loading = false;
  }

  goImages(npno: any, checked: any){
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('expanded',this.exp)
    let filters = {
      'name': this.name,
      'item': this.vitem,
      'app': this.app,
      'img': this.img,
      'number': this.npno,
      'items': this.lvl,
      'style': this.styl,
      'template': this.vfg,
      'category': this.ctno
    }
    localStorage.setItem('filters', JSON.stringify(filters))

    if(npno && !checked){
      this.router.navigate(['/uniforms/images/' + this.page.rfno + '/' + npno]);
    } else {
      let selections = []
      for (let i = 0; i < this.checkedImg.length; i++) {
        selections.push(this.checkedImg[i].npno)
      }
      if(selections.length > 0){
        localStorage.setItem('checked',selections.toString())
        this.router.navigate(['/uniforms/image/' + this.page.rfno]);
      } else {
        window.alert("Must select at least one customization for attachments");
      }
    }
    
  }

  searchConfig(mode: string){
    var config ={
      displayKey: "desc",
      search: true,
      placeholder: mode,
      height: '300px',
      noResultsFound: 'No results found',
      searchOnKey: mode == 'Style' ? 'styl' : 'desc',
      customComparator: (i1: any,i2: any) => {
        let ret = i1[config.displayKey] < i2[config.displayKey];
        return ret? -1: 1;
      }
    }
    return config
  }

  loadVAS(npno: any){
    localStorage.setItem('UP_AUTH','Y')
    localStorage.setItem('expanded',this.exp)
    localStorage.setItem('p2',this.p.toString())
    let filters = {
      'name': this.name,
      'item': this.vitem,
      'app': this.app,
      'img': this.img,
      'number': this.npno,
      'items': this.lvl,
      'style': this.styl,
      'template': this.vfg,
      'category': this.ctno
    }
    localStorage.setItem('filters', JSON.stringify(filters))
    this.router.navigate(['/uniforms/vasapplications/' + this.page.rfno + '/' + npno]);
  }

  onItemChange(event: number){
    showWait();
    this.itemsPerPage = event
    this.getCustomizations('')
  }

  onPageChange(event: number) {
    showWait();
    this.p = event
    this.getCustomizations('')
  }

  getImage(image: any){
    return environment.apiurl + '/photos/uniforms/' + image.anam
  }

  clearFilters(){
    this.name = ""
    this.vitem = ""
    this.app = ""
    this.img = ""
    this.npno = ""
    this.lvl = ""
    this.styl = ""
    this.vfg = ""
    this.ctno = ""
    this.getCustomizations('')
  }
}
