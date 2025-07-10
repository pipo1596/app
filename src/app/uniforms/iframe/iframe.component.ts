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
  error = ""

  constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  @HostListener('window:message', ['$event']) onMessage(event: MessageEvent) {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate([localStorage.getItem('partpg') + event.data.data]);
  }

  ngOnInit(): void {
    localStorage.clear();
    hideWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    this.menu = localStorage.getItem('menu');
    this.p1 = localStorage.getItem('p1');
  }

  getSafeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiurl + url);
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    if(localStorage.getItem('p1')){
      this.router.navigate([ localStorage.getItem('partpg')! + localStorage.getItem('p1') ]);
    } else {
      this.router.navigate([localStorage.getItem('partpg')]);
    }
  }

}
