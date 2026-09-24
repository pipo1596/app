import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  private titleSub = new BehaviorSubject<string>('');
  private menuSub = new BehaviorSubject<string>('');
  private nhnoSub = new BehaviorSubject<string>('');
  private pgNameSub = new BehaviorSubject<string>('');
  title$ = this.titleSub.asObservable();
  menu$ = this.menuSub.asObservable();
  nhno$ = this.nhnoSub.asObservable();
  pgName$ = this.pgNameSub.asObservable();
  expandedValue: string = '';

  setTitle(title: string) { if (title) this.titleSub.next(title); }
  setMenu(menu: string) { if (menu) this.menuSub.next(menu); }

setProgram(nhno: string | null, pgName: string | null) {
  if (!nhno || !pgName) return;
  if (nhno !== this.nhnoSub.value) {
    this.nhnoSub.next(nhno);
    this.pgNameSub.next(pgName);
  }
}
}