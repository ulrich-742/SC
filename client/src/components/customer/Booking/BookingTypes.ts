import type { Barber } from "../../../types/barber";
import type { Prestation } from "../../../types/prestation";

export type Booking = {
  barber?: Barber;
  prestation?: Prestation;
  appointmentDate?: string;
  appointmentTime?: string;
  locationType?: string;
};
