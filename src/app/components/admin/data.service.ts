import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private listSource = new Subject<any[]>();
  list$ = this.listSource.asObservable();

  sendList(list: any[]) {
    this.listSource.next(list);
  }
}
