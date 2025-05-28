import { HostListener, Component} from '@angular/core';
import { Page } from '../../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { hideWait } from '../../../shared/utils';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  page = new Page();
  error = ""
  programName = ""
  customerAcct = ""

  constructor(private http: HttpClient,
    private router: Router, private sanitizer: DomSanitizer
  ) { }

  @HostListener('window:message', ['$event']) onMessage(event: MessageEvent) {
    this.router.navigate(['/uniforms/newuniform/' + event.data]);
  }

  ngOnInit(): void {
    hideWait();
  }

  getSafeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
}
