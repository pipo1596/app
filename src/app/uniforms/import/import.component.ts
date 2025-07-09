import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.page.menu = 'Y'
    this.route.paramMap.subscribe(params => {
      this.page.rfno = params.get('nhno');
    });
    hideWait();
    this.page.loading = false;
  }

  loadUpload(ulid: any){
    this.router.navigate(['/uniforms/' + ulid + '/' + this.page.rfno + '/' + ulid]);
  }

}
