import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppQuestionsService {
  applications:any[][] = []

  constructor() { }

  setApp(app: any){
    this.applications.push([app,{}])
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
