import { useState } from "react";
import { useLocation } from "react-router";

import Carrousel from "../../../components/carrousel/Carrousel";
import BookingConfirmation from "../../../components/customer/Booking/BookingConfirmation";
import BookingForm from "../../../components/customer/Booking/BookingForm";
import BookingSummary from "../../../components/customer/Booking/BookingSummary";
import type { Booking } from "../../../components/customer/Booking/BookingTypes";
import Stepper from "../../../components/customer/Booking/Stepper";
import useBarbers from "../../../hooks/useBarbers";
import usePrestations from "../../../hooks/usePrestations";

import "./BookingPage.css";

function BookingPage() {
  const [step, setStep] = useState(1);
  const location = useLocation();
  const barbers = useBarbers();

  const [booking, setBooking] = useState<Booking>({
    barber: location.state?.barber,
    locationType: "Salon",
  });
  const prestations = usePrestations(booking.barber?.id_user);
  return (
    <main className="reservation-page">
      <div className="reservation-page__container">
        <Stepper currentStep={step} />

        <div className="reservation-page__content">
          {step === 1 && (
            <>
              <div className="Carrousel_mouve">
                <Carrousel
                  barbers={barbers}
                  selectedBarber={booking.barber}
                  onSelectBarber={(barber) =>
                    setBooking((previousBooking) => ({
                      ...previousBooking,
                      barber,
                    }))
                  }
                />
              </div>
              <div className="booking-form-wrapper">
                <BookingForm
                  booking={booking}
                  setBooking={setBooking}
                  prestations={prestations}
                  onNext={() => setStep(2)}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <BookingSummary
              booking={booking}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && <BookingConfirmation booking={booking} />}
        </div>
      </div>
    </main>
  );
}

export default BookingPage;
