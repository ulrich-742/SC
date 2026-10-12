ALTER TABLE review ADD CONSTRAINT uq_review_appointment UNIQUE (id_appointment);
ALTER TABLE barber_availability ADD CONSTRAINT uq_barber_slot UNIQUE (id_user, start_time);
CREATE INDEX idx_appointment_customer_date ON appointment (id_user_customer, appointment_date);
CREATE INDEX idx_appointment_barber_date ON appointment (id_user_barber, appointment_date);
CREATE INDEX idx_availability_lookup ON barber_availability (id_user, start_time, is_booked);
