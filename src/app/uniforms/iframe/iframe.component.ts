import { HostListener, Component} from '@angular/core';
import { Page } from '../../shared/textField';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait } from '../../shared/utils';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-iframe',
  standalone: false,
  templateUrl: './iframe.component.html',
  styleUrl: './iframe.component.css'
})
export class IframeComponent {
  page = new Page();
  menu: any;
  p1: any;
  partpg: any;
  error = ""

  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  @HostListener('window:message', ['$event']) onMessage(event: MessageEvent) {
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('p1',this.p1);
    this.router.navigate([this.partpg + event.data.data]);
  }

  ngOnInit(): void {
    hideWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.menu = localStorage.getItem('menu');
    this.p1 = localStorage.getItem('p1');
    this.partpg = localStorage.getItem('partpg');
    // localStorage.clear()
  }

  getSafeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiurl + url);
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('p1',this.p1);
    if(this.p1 && this.menu.indexOf('editcustomer') !== -1){
      this.router.navigate([ this.partpg + this.p1 ]);
    } else {
      this.router.navigate([this.partpg]);
    }
  }

}
