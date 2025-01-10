import { Injectable } from '@angular/core';
  import { Subject } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class DataService {
    private triggerChildSubject = new Subject<any>();

    triggerChild(data: any) {
      this.triggerChildSubject.next(data);
    }

    getTriggerChildObservable() {
      return this.triggerChildSubject.asObservable();
    }
  }