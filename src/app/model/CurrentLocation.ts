import { LatLng } from "leaflet";

export interface CurrentLocation {
  id: Int16Array;
  address : string;
  latitude : number;
  longitude: number;
}