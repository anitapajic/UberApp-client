import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {User} from "../../../model/User";
import {Panic} from "../../../model/Panic";
import {FollowRideDriverComponent} from "../../registered-user/follow-ride-driver/follow-ride-driver.component";
import {DataService} from "../data.service";

@Component({
  selector: 'app-panic',
  templateUrl: './panic.component.html',
  styleUrls: ['./panic.component.css']
})
export class PanicComponent implements OnInit{

  constructor(private authService : AuthService, private dataService: DataService){};

  panics: Array<Panic> =[];
  noPanics: boolean = false;

  ngOnInit() {
      this.dataService.list$.subscribe(list => {
      this.panics = list;
        if(this.panics.length === 0){
          this.noPanics = true;
        }
      });
  }

}
