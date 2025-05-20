import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { showWait, hideWait } from '../../shared/utils';

@Component({
  selector: 'app-uniform',
  standalone: false,
  templateUrl: './uniform.component.html',
  styleUrl: './uniform.component.css'
})
export class UniformComponent {
  @Output() triggerEvent = new EventEmitter<string>();
  page = new Page();
  error = "";
  programName = ""
  customerAcct = ""

  constructor(private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    hideWait();
  }

  newUniform() {
    showWait('Creating your new Uniform Program...');

    let data = {
      mode: 'create',
      name: this.programName,
      acno: this.customerAcct
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNH', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.result == 'pass' && this.page.data.nhno){
        this.router.navigate(['/uniforms/dashboard/' + this.page.data.nhno]);
      } else {
        this.error = this.page.data.errors
        hideWait();
      }
    });

  }

  goBack() {
    this.router.navigate(['/uniforms/']);
  }

}
