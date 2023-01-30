import { Component } from '@angular/core';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.css']
})
export class RatingsComponent {
  
  star:any;
  postToController(): void{
    var starChecked = document.querySelector('input[name="rating"]:checked') as HTMLInputElement;
    console.log(starChecked.value)
    var star = document.getElementById('myratings') as HTMLElement;
    star.innerHTML = starChecked.value;

}
}
