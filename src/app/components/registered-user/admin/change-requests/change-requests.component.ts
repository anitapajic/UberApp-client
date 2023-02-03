import { Component } from '@angular/core';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-requests',
  templateUrl: './change-requests.component.html',
  styleUrls: ['./change-requests.component.css']
})
export class ChangeRequestsComponent {
  constructor(private authService : AuthService, private userService : UserService){};
  requests: Array<User> = [];
  
  noRequests: boolean = false;

  decline(id: number){
    this.userService.deleteRequest(id).subscribe({
      next: (result) => {
        console.log(result);
        this.ngOnInit()
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  approve(id: number){
    this.userService.approveRequest(id).subscribe({
      next: (result) => {
        console.log(result);
        this.ngOnInit()
      },
      error: (error) => {
        console.log(error);
      },
    });

  }

  ngOnInit() {
   
    this.userService.getChangeRequests().subscribe({
      next: (result) => {
        this.requests = result;
        console.log(this.requests);
        if(this.requests.length === 0){
          this.noRequests = true;
        }

      },
      error: (error) => {
        console.log(error);
      },
    });
  
  
  }

}
