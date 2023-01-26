import { Component } from '@angular/core';
import { User } from 'src/app/model/User';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-change-requests',
  templateUrl: './change-requests.component.html',
  styleUrls: ['./change-requests.component.css']
})
export class ChangeRequestsComponent {
  constructor(private authService : AuthService){};
  requests: Array<User> = [];
  
  noRequests: boolean = false;

  decline(id: Int16Array){
    this.authService.deleteRequest(id).subscribe({
      next: (result) => {
        console.log(result);
        this.ngOnInit()
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  approve(id: Int16Array){
    this.authService.approveRequest(id).subscribe({
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
   
    this.authService.getChangeRequests().subscribe({
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
