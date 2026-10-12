export type Review = {
  id_review: number;
  rating: number;
  comment: string;
  reporting: number;
  created_at: string;
  id_appointment: number;
};

export type AdminReview = Review & {
  appointment_date: string;
  appointment_status: "en attente" | "confirmé" | "terminé" | "annulé" | string;
  appointment_location_type: string;
  barber_name: string;
  barber_phone: string | null;
  barber_email: string;
  barber_avatar_url: string;
  customer_firstname: string;
  customer_lastname: string;
  customer_phone: string | null;
  customer_email: string;
  customer_avatar_url: string;
  prestation_name: string;
  prestation_price: string;
};
