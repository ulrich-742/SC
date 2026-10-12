export type Reservation = {
  id_appointment: number;
  appointment_date: string;
  status: string;
  location_type: string;

  id_prestation: number;
  id_user_barber: number;
  id_user_customer: number;
  barber_avatar: string;
  barber_name: string;
  customer_firstname: string;
  customer_lastname: string;
  customer_avatar: string | null;
  prestation_name: string;
};
