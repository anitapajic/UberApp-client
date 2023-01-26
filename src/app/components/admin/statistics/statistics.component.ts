import { Component } from '@angular/core';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  data = [
    { data: [65, 59, 80, 81, 56], label: 'Prihodi' },
    { data: [28, 48, 40, 19, 86], label: 'Rashodi' }
  ];
  labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
}
