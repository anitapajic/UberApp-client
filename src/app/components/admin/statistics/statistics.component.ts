import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {ActivatedRoute} from "@angular/router";
import {Ride} from "../../../model/Ride";
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit{
  constructor(private authService : AuthService){}
  totalIncome = 0;
  totalNumberOfRides = 0;
  filter : any;
  income: Map<String, Number> = new Map<String, Number>();
  incomeDates: Array<String> = new Array<String>();
  incomeValues : Array<Number> = new Array<Number>();

  // @ViewChild('startInput') startDate: ElementRef | undefined;
  // @ViewChild('endInput') endDate: ElementRef | undefined;
  //
  //
  // @ViewChild('startInput2') startDate2: ElementRef | undefined;
  // @ViewChild('endInput2') endDate2: ElementRef | undefined;

  ngOnInit(): void {
    this.authService.getTotalIncome().subscribe({next:(result)=>{this.totalIncome = result;}});
    this.authService.getTotalNumberOfRides().subscribe({next:(result)=>{this.totalNumberOfRides = result;}});
    }

  data = [
    { data: [21560, 45320, 35624, 45200, 55800, 50840, 48700], label: 'Income', backgroundColor:'#D14054' }
  ];
  labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  datasets = [
    {data: [21560, 45320, 35624, 45200, 55800, 50840, 48700], label: 'Number of Rides' , backgroundColor: '#25313C'},
  ];

  // filterDates(){
  //   this.filter = {
  //     startDate :this.startDate?.nativeElement.value,
  //     endDate : this.endDate?.nativeElement.value,
  //   }
  //   console.log(this.filter)
  //   this.authService.getIncomeFromDates(this.filter).subscribe({
  //     next: (result) => {
  //       this.income = result;
  //       console.log(this.income)
  //       for(let i in this.income.keys()){
  //         this.incomeDates.push(i);
  //       }
  //       for (let j in this.income.values()){
  //         this.incomeValues.push(Number(j));
  //       }
  //     },
  //     error:(error)=>{
  //       console.log(error);
  //     }
  //   });
  // }
  onClick(){
    console.log("aaaaaaaaaaaaaa")
  }
}
