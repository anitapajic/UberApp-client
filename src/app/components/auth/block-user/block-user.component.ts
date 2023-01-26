import { Component, ViewChild } from '@angular/core';
import { User } from 'src/app/model/User';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-block-user',
  templateUrl: './block-user.component.html',
  styleUrls: ['./block-user.component.css']
})
export class BlockUserComponent {
  constructor(private authService : AuthService){};
  users: Array<User> = [];
  
  block(id: Int16Array, note:String){
    console.log(note)
    if(note.length != 0){
      this.authService.sendNote({message : note, userId : id}).subscribe({
        next: (result) => {
          console.log(result);
          alert("Note successfully sent")
        },
        error: (error) => {
          console.log(error);
        },
      });
    }


    this.authService.blockUser(id).subscribe({
      next: (result) => {
        console.log(result);
        this.ngOnInit()
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  unblock(id: Int16Array){
    this.authService.unblockUser(id).subscribe({
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
   
    this.authService.getUsersWithNotes().subscribe({
      next: (result) => {
        this.users = result['results'];
        console.log(this.users);
      },
      error: (error) => {
        console.log(error);
      },
    });
  
  
  }
}
