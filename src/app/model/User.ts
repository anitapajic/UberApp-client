import { Vehicle } from "./Vehicle";

export interface User {
    id: Int16Array;
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
    id: Int16Array;
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