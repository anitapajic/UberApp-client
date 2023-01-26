import { Component } from '@angular/core';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  data = [
    { data: [21560, 45320, 35624, 45200, 55800, 50840, 48700], label: 'Income', backgroundColor:'#D14054' }
  ];
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  datasets = [
    {data: [21560, 45320, 35624, 45200, 55800, 50840, 48700], label: 'Number of Rides' , backgroundColor: '#25313C'},
  ];
}
