import { CurrentLocation } from "./CurrentLocation";

export interface Vehicle {
  id: Int16Array;
  model : string;
  vehicleType : string;
  licenseNumber: string;
  passengerSeats : number;
  currentLocation : CurrentLocation;
  babyTransport : boolean;
  petTransport : boolean;
  driverActive: boolean;
  driverId:Int16Array;
}
