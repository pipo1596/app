import { HostListener, Component} from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { hideWait } from '../../shared/utils';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pricelist',
  standalone: false,
  templateUrl: './pricelist.component.html',
  styleUrl: './pricelist.component.css'
})
export class PricelistComponent {
  page = new Page();
  error = ""

  constructor(private http: HttpClient,
    private router: Router, private sanitizer: DomSanitizer
  ) { }

  @HostListener('window:message', ['$event']) onMessage(event: MessageEvent) {
    this.router.navigate([localStorage.getItem('partpg') + event.data.data]);
  }

  ngOnInit(): void {
    hideWait();
  }

  getSafeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack() {
    if(localStorage.getItem('plno')){
      this.router.navigate([ localStorage.getItem('partpg')! + localStorage.getItem('plno') ]);
    } else {
      this.router.navigate([localStorage.getItem('partpg')]);
    }
  }

}
