import { CurrentLocation } from "./CurrentLocation";

export interface Vehicle {
  id: number;
  model : string;
  vehicleType : string;
  licenseNumber: string;
  passengerSeats : number;
  location : CurrentLocation;
  babyTransport : boolean;
  petTransport : boolean;
  driverActive: boolean;
  driverId:Int16Array;
}

export interface CreateVehicle {
  model : string | null | undefined;
  vehicleType : string | null | undefined;
  licenseNumber: string | null | undefined;
  passengerSeats : string | null | undefined;
  babyTransport : boolean | null | undefined;
  petTransport : boolean | null | undefined;
}
