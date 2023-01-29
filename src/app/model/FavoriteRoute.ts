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
  babyTrasnport : boolean;
  petTransport : boolean;
}