import { Component } from '@angular/core';
import { Page } from '../../shared/textField';
import { Router } from '@angular/router';
import {hideWait } from '../../shared/utils';

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
  ) { }

  ngOnInit(): void {
    hideWait();
    this.page.loading = false;
    this.page.menu = 'Y'
  }

  loadUpload(ulid: any){
    this.router.navigate(['/uniforms/' + ulid + '/' + this.page.rfno + '/' + ulid]);
  }

}
