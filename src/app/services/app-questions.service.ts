import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppQuestionsService {
  applications:any[][] = []

  constructor() { }

  clrAll() {
    this.applications = [];
  }

  setApp(app: any){
    let included = false;
    for (let i = 0; i < this.applications.length; i++) {
      if(JSON.stringify(this.applications[i][0]) == JSON.stringify(app)){
        included = true
      }
    }
    if(!included){
      this.applications.push([app,{}])
    }
  }

  clrApp(app: any){
    for (let i = 0; i < this.applications.length; i++) {
      if(this.applications[i][0] == app){
        this.applications.splice(i,1)
      }
    }
  }

  getApp(){
    return this.applications;
  }

  setQuestions(app: any, questions: any){
    for (let i = 0; i < this.applications.length; i++) {
      if(this.applications[i][0] == app){
        this.applications[i][1] = questions
      }
    }
  }
}
