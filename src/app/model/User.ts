import { Vehicle } from "./Vehicle";

export interface User {
    id: number;
    username: string;
    name: string;
    surname: string;
    telephoneNumber: string;    
    address: string;
    active: boolean;
    blocked: boolean;
    authorities : string;
  }
  
  export interface Driver {
    id: number;
    username: string;
    name: string;
    surname: string;
    telephoneNumber: string;    
    address: string;
    active: boolean;
    blocked: boolean;
    authorities : string;
    vehicle : Vehicle ;
  }