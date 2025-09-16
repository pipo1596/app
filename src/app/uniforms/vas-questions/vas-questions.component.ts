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
  @Input() all : any;

  page = new Page();
  errors = ""
  msg = ""
  rules: any;
  
  constructor(
    private http: HttpClient, 
    private router: Router
  ){}

  ngOnInit(): void {
    this.getQuestions('','')
  }

  getQuestions(rules: any, temp: any){
    showWait();
    let data = {
      mode: 'getInfo',
      nhno: this.nhno,
      n1no: this.application?.n1no,
      npno: this.npno,
      v1cd: this.application?.v1cd,
      rules: rules ? rules : ''
    }

    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPLMNV2', data).subscribe(response => {
      this.page.data = response;

      if(this.page.data?.vasq.length > 0 && temp){
        for (let i = 0; i < this.page.data?.vasq.length; i++) {
          this.page.data.vasq[i].dfan = temp[i].dfan
          this.page.data.vasq[i].dflk = temp[i].dflk
          this.page.data.vasq[i].dspd = temp[i].dspd
        } 
      }
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
    localStorage.setItem('allexpand',this.all ? 'Y' : '');
    this.router.navigate(['/uniforms/vasquestion/' + this.nhno + '/' + this.npno]);
  }

  saveQuestions(mode: any){
    showWait();
    this.errors = ""
    this.msg = ""
    let n2no = [];
    let v2no = [];
    let type = [];
    let dfan = [];
    let dspd = [];
    let dflk = [];
    let upct = [];
    let ansq = [];
    let rules = [];


    for (let i = 0; i < this.page.data?.vasq.length; i++) {
      n2no.push(this.page.data?.vasq[i]!.n2no);
      v2no.push(this.page.data?.vasq[i]!.v2no);
      type.push(this.page.data?.vasq[i]!.type);
      upct.push(this.page.data?.vasq[i].upct);
      ansq.push('1');
      dfan.push((<HTMLInputElement>document.getElementById('dfan' + i + this.page.data?.vasq[i]!.n2no)).value);
      dspd.push((<HTMLInputElement>document.getElementById('dspd' + i + this.page.data?.vasq[i]!.n2no)).checked ? 'Y' : 'N');
      dflk.push((<HTMLInputElement>document.getElementById('dflk' + i + this.page.data?.vasq[i]!.n2no)).checked ? 'Y' : 'N');
    } 

    let data = {
      mode: mode == 'validate' ? 'validate' : 'update',
      nhno: this.nhno,
      npno: this.npno,
      n1no: this.application?.n1no,
      n2no: n2no, 
      v1cd: this.application?.v1cd,
      v2no: v2no,
      type: type,
      dfan: dfan,
      dspd: dspd,
      dflk: dflk,
      upct: upct,
      ansq: ansq
    }
  
    this.http.post(environment.apiurl + '/cgi/APPAPI?PMPGM=APPSRNV2B', data).subscribe(response => {
      let temp = new Page();
      temp.data = response;
      if (temp.data.result !== 'pass'){
        if(this.errors == ""){
          this.errors = temp.data.errors
        } else this.errors = this.errors + ',' + temp.data.errors

      if(temp.data.rules.length > 0){
        for (let i = 0; i < temp.data.rules.length; i++) {
          let rule = temp.data.rules[i].ques
          if(temp.data.rules[i].drop) rule += ( ',' + temp.data.rules[i].drop)
          if(temp.data.rules[i].dfan) rule += ( ',' + temp.data.rules[i].dfan)
          if(temp.data.rules[i].dflk) rule += ( ',' + temp.data.rules[i].dflk)
          rules.push(rule)
        }
        this.getQuestions(rules, temp.data.questions);
      } else {
        for (let x = 0; x < temp.data?.questions.length; x++){
          if(temp.data?.questions[x]?.rulesV){
            for (let i = 0; i < temp.data.questions[x].rulesV.length; i++) {
              let rule = temp.data.questions[x].rulesV[i].ques
              if(temp.data.questions[x].rulesV[i].drop) rule += ( ',' + temp.data.questions[x].rulesV[i].drop)
              if(temp.data.questions[x].rulesV[i].dfan) rule += ( ',' + temp.data.questions[x].rulesV[i].dfan)
              if(temp.data.questions[x].rulesV[i].dflk) rule += ( ',' + temp.data.questions[x].rulesV[i].dflk)
              rules.push(rule)
            }
          }
        }
        this.getQuestions(rules, temp.data.questions);
      }


      } else{
        if (mode !== 'validate') this.msg = "Questions updated successfully"
        localStorage.setItem('allexpand',this.all ? 'Y' : '');
        if (mode !== 'validate') location.reload();
        if (mode !== 'validate') this.getQuestions('','');

        if(mode == 'validate'){
          for (let x = 0; x < temp.data?.questions.length; x++){
            if(temp.data?.questions[x]?.rulesV){
              for (let i = 0; i < temp.data.questions[x].rulesV.length; i++) {
                let rule = temp.data.questions[x].rulesV[i].ques
                if(temp.data.questions[x].rulesV[i].drop) rule += ( ',' + temp.data.questions[x].rulesV[i].drop)
                if(temp.data.questions[x].rulesV[i].dfan) rule += ( ',' + temp.data.questions[x].rulesV[i].dfan)
                if(temp.data.questions[x].rulesV[i].dflk) rule += ( ',' + temp.data.questions[x].rulesV[i].dflk)
                rules.push(rule)
              }
            }
          }
          this.getQuestions(rules, temp.data.questions);
        }
        
      }
    });
    
    hideWait();
    this.page.loading = false;
  }

}
