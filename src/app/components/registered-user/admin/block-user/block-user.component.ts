import { Component, ViewChild } from '@angular/core';
import { User } from 'src/app/model/User';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BlockUserService } from 'src/app/services/user-block/block-user.service';

@Component({
  selector: 'app-block-user',
  templateUrl: './block-user.component.html',
  styleUrls: ['./block-user.component.css']
})
export class BlockUserComponent {
  constructor(private authService : AuthService, private blockService: BlockUserService){};
  users: Array<User> = [];
  
  block(id: number, note:string){
    console.log(note)
    if(note.length != 0){
      this.blockService.sendNote({message : note, userId : id}).subscribe({
        next: (result) => {
          console.log(result);
          alert("Note successfully sent")
        },
        error: (error) => {
          console.log(error);
        },
      });
    }


    this.blockService.blockUser(id).subscribe({
      next: (result) => {
        console.log(result);
        this.ngOnInit()
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  unblock(id: number){
    this.blockService.unblockUser(id).subscribe({
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
   
    this.blockService.getUsersWithNotes().subscribe({
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
