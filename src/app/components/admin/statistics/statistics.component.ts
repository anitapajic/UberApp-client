import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import {ActivatedRoute} from "@angular/router";
import {Ride} from "../../../model/Ride";
import {Chart} from "chart.js";
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit{
  constructor(private authService : AuthService){}
  totalIncome = 0;
  totalNumberOfRides = 0;
  numOfKm = 0;
  todaysIncome = 0;
  filter : any;
  filter2 : any;
  income: Map<String, Number> = new Map<String, Number>();
  incomeDates: Array<String> = new Array<String>();
  incomeValues : Array<Number> = new Array<Number>();
  rides: Map<String, Number> = new Map<String, Number>();
  rideDates: Array<String> = new Array<String>();
  rideValues : Array<Number> = new Array<Number>();

  @ViewChild('startInput') startDate: ElementRef | undefined;
  @ViewChild('endInput') endDate: ElementRef | undefined;


  @ViewChild('startInputRides') startDateRides: ElementRef | undefined;
  @ViewChild('endInputRides') endDateRides: ElementRef | undefined;

  ngOnInit(): void {
    this.authService.getTotalIncome().subscribe({next:(result)=>{this.totalIncome = result;}});
    this.authService.getTotalNumberOfRides().subscribe({next:(result)=>{this.totalNumberOfRides = result;}});
    this.authService.getTotalNumOfKm().subscribe({next:(result)=>{this.numOfKm = result;}});
    this.authService.getTodaysIncome().subscribe({next:(result)=>{this.todaysIncome = result;}});
    }

  data = [
    { data: this.incomeValues, label: 'Income', backgroundColor:'#D14054' }
  ];
  labels = this.incomeDates;
  labelsRides = this.rideDates;

  dataRides = [
    {data: this.rideValues, label: 'Number of Rides' , backgroundColor: '#25313C'},
  ];

  filterDates(){
    this.filter = {
      startDate :this.startDate?.nativeElement.value,
      endDate : this.endDate?.nativeElement.value,
    }
    console.log(this.filter)
    this.authService.getIncomeFromDates(this.filter).subscribe({
      next: (result) => {
        this.income = result;
        console.log(this.income)
        this.incomeDates = Array.from(Object.keys(this.income));
        this.incomeValues = Array.from(Object.values(this.income));
        this.data = [
          { data: this.incomeValues, label: 'Income', backgroundColor:'#D14054' }
        ];
        this.labels = this.incomeDates;
      },
      error:(error)=>{
        console.log(error);
      }
    });
  }

  filterRideDates(){
    this.filter2 = {
      startDateRides :this.startDateRides?.nativeElement.value,
      endDateRides : this.endDateRides?.nativeElement.value,
    }
    console.log(this.filter2)
    this.authService.getRidesFromDates(this.filter2).subscribe({
      next: (result) => {
        this.rides = result;
        console.log(this.rides)
        this.rideDates = Array.from(Object.keys(this.rides));
        this.rideValues = Array.from(Object.values(this.rides));
        this.dataRides = [
          { data: this.rideValues, label: 'Number Of Rides', backgroundColor:'#25313C' }
        ];
        this.labelsRides = this.rideDates;
      },
      error:(error)=>{
        console.log(error);
      }
    });
  }
  onClick(){
    console.log("aaaaaaaaaaaaaa")
  }
}
