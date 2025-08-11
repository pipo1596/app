import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Page } from '../../shared/textField';
import { Router } from '@angular/router';
import { hideWait, showWait } from '../../shared/utils';

@Component({
  selector: 'app-vas-questions',
  standalone: false,
  templateUrl: './vas-questions.component.html',
  styleUrl: './vas-questions.component.css'
})
export class VasQuestionsComponent {
  @Input() nhno : any = "";
  @Input() npno : any = "";
  @Input() application : any = "";
  @Input() expanded : any = [];

  page = new Page();
  errors = ""
  msg = ""
  
  constructor(
    private http: HttpClient, 
    private router: Router
  ){}

  ngOnInit(): void {
    this.getQuestions()
  }

  getQuestions(){
    showWait();
    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      n1no: this.application?.n1no,
      npno: this.npno,
      v1cd: this.application?.v1cd
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNV2', data).subscribe(response => {
      this.page.data = response;
      hideWait();
    });
  }

  editQuestion(question: any){
    let application = {
      nhno: this.nhno,
      npno: this.npno,
      n1no: this.application?.n1no,
      n2no: question.n2no, 
      v1cd: this.application?.v1cd,
      v2no: question.v2no
    }
    localStorage.setItem('UP_AUTH','Y');
    localStorage.setItem('vasApp',JSON.stringify(application));
    this.router.navigate(['/uniforms/vasquestion/' + this.nhno + '/' + this.npno]);
  }

  saveQuestions(){
    showWait();
    this.errors = ""
    this.msg = ""
    for (let i = 0; i < this.page.data?.vasq.length; i++) {
      
      let data = {
        mode: 'update',
        nhno: this.nhno,
        npno: this.npno,
        n1no: this.application?.n1no,
        n2no: this.page.data.vasq[i].n2no, 
        v1cd: this.application?.v1cd,
        v2no: this.page.data.vasq[i].v2no,
        type: this.page.data.vasq[i].type,
        dfan: (<HTMLInputElement>document.getElementById('dfan' + i + this.page.data.vasq[i].n2no)).value,
        dspd: (<HTMLInputElement>document.getElementById('dspd' + i + this.page.data.vasq[i].n2no)).value == 'Y' ? 'Y' : 'N',
        dflk: (<HTMLInputElement>document.getElementById('dflk' + i + this.page.data.vasq[i].n2no)).checked ? 'Y' : 'N',
        upct: this.page.data.vasq[i].upct,
        app: 'Y'
      }

      this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV2', data).subscribe(response => {
        let temp = new Page();
        temp.data = response;
        if (temp.data.result !== 'pass'){
          if(this.errors == ""){
            this.errors = temp.data.errors
          } else this.errors = this.errors + ',' + temp.data.errors
        } else{
          this.msg = "Questions updated successfully"
          location.reload();
        }
      });
    } 

    if(this.errors == ""){
      showWait()
      this.getQuestions();
    }
    hideWait();
    this.page.loading = false;
  }

}
