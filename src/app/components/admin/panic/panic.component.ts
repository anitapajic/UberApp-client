import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {User} from "../../../model/User";
import {Panic} from "../../../model/Panic";

@Component({
  selector: 'app-panic',
  templateUrl: './panic.component.html',
  styleUrls: ['./panic.component.css']
})
export class PanicComponent implements OnInit{

  constructor(private authService : AuthService){};
  panics: Array<Panic> = [];
  noPanics: boolean = false;

  ngOnInit() {

    this.authService.getChangeRequests().subscribe({
      next: (result) => {
        this.panics = result;
        console.log(this.panics);
        if(this.panics.length === 0){
          this.noPanics = true;
        }

      },
      error: (error) => {
        console.log(error);
      },
    });


  }
}
