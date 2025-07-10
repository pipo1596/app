import { Component} from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { hideWait } from '../../shared/utils';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image',
  standalone: false,
  templateUrl: './image.component.html',
  styleUrl: './image.component.css'
})
export class ImageComponent {
  page = new Page();
  error = ""

  constructor(private http: HttpClient,
    private router: Router, private sanitizer: DomSanitizer, private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    localStorage.clear();
    hideWait();
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
  }

  getSafeUrl(url: string): SafeResourceUrl {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  goBack() {
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate([localStorage.getItem('partpg')]);
  }

  }

