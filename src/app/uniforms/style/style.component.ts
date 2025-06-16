import { HostListener, Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait } from '../../shared/utils';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-style',
  standalone: false,
  templateUrl: './style.component.html',
  styleUrl: './style.component.css'
})
export class StyleComponent {
  page = new Page();
  error = "";
  programName = ""
  nhno: any;
  iframeUrl: any;

  constructor(private http: HttpClient,
    private router: Router, 
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  @HostListener('window:message', ['$event']) onMessage(event: MessageEvent) {
    this.router.navigate([localStorage.getItem('partpg') + event.data.data]);
  }

  ngOnInit(): void {
    hideWait();
      this.route.paramMap.subscribe(params => {
      this.nhno = params.get('nhno')
    });
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack() {
    if(localStorage.getItem('styl')){
      this.router.navigate([ localStorage.getItem('partpg')! + localStorage.getItem('styl') ]);
    } else {
      this.router.navigate([localStorage.getItem('partpg')]);
    }
  }

}
