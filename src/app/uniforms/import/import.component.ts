import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { hideWait } from '../../shared/utils';

@Component({
  selector: 'app-import',
  standalone: false,
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent {
  page = new Page();

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    hideWait();
    this.page.loading = false;
    this.page.menu = 'Y'
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
  }

  loadUpload(ulid: any){
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/' + ulid + '/' + this.page.rfno + '/' + ulid]);
  }

}
