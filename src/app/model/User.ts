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
  