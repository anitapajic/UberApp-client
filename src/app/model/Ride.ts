import { Path } from './Path';
import { Rejection } from './Rejection';
import { Review } from './Review';
import { User } from './User';
import { Vehicle } from './Vehicle';

export interface Ride {
  id: number;
  startTime: string | null;
  endTime: string | null;
  totalCost: number;
  driver : User;
  passengers : Array<User>;
  locations : Array<Path>;
  estimatedTimeInMinutes: number;
  reviews : Array<Review>;
  rejections : Array<Rejection>;
  status : string;
  panic : boolean;
  babyTrasnport : boolean;
  petTransport : boolean;
  routeJSON : string;
  vehicle : Vehicle;
}


export interface CreateRide {

  locations : Array<Path>;
  babyTrasnport : boolean;
  petTransport : boolean;
  vehicleType : string;
  routeJSON : string;
}

export interface RideInfo {
  locations : Array<Path>;
  babyTrasnport : boolean;
  petTransport : boolean;
  vehicleType : string;
}
