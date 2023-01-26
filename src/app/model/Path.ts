import { CurrentLocation } from "./CurrentLocation";

export interface Path{
    // id : Int16Array;
    departure : CurrentLocation;
    destination : CurrentLocation;
}