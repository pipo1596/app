import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Page } from '../../shared/textField';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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
  programName: any = "";
  acno: any

  constructor(private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    if(localStorage.getItem('p1')) this.programName = localStorage.getItem('p1');
    localStorage.clear();
    hideWait();
    this.route.paramMap.subscribe(params => {
      this.acno = params.get('acno');
    });
  }

  newUniform() {
    showWait('Creating your new Uniform Program...');

    let data = {
      mode: 'create',
      name: this.programName,
      acno: this.acno
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNH', data).subscribe(response => {
      this.page.data = response;
      if (this.page.data.result == 'pass' && this.page.data.nhno){
        localStorage.setItem('UP_AUTH','Y');
        this.router.navigate(['/uniforms/dashboard/' + this.page.data.nhno]);
      } else {
        this.error = this.page.data.errors
        hideWait();
      }
    });

  }

  inqAccount() {
    localStorage.clear();
    localStorage.setItem('p1', this.programName);
    localStorage.setItem('partpg','/uniforms/newuniform/')
    localStorage.setItem('menu','/cgi/APOELMAC?PAMODE=*INQ&PMFRAMEID=bottomFrame&PMFRAMEIDE=topFrame&PMFRAMEO=Y&PMEDIT=N')
    localStorage.setItem('UP_AUTH','Y');
    this.router.navigate(['/uniforms/iframe/APOELMAC'])
  }

}
