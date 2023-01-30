import {UserPanic} from "./UserPanic";

export interface Panic {
  id: number;
  reason : string;
  time : Date;
  sender : UserPanic;
}
