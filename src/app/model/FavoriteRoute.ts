import { Path } from "./Path";
import { User } from "./User";
import { Vehicle } from "./Vehicle";

export interface FavoriteRoute{
  id: number;
  favoriteName: string | null;
  scheduledTime: string | null;
  locations: Array<Path>;
  passengers : Array<User>;
  vehicleType : Vehicle;
  babyTransport : boolean;
  petTransport : boolean;
}
export interface FavoriteRouteCreate{
  favoriteName: string | null;
  scheduledTime: string | null;
  locations: Array<Path>;
  passengers :  Array<UserId>;
  vehicleType : string;
  babyTransport : boolean;
  petTransport : boolean;
}
export interface UserId{
  id:number;
}