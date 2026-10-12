import "./Stepper.css";

type StepperProps = {
  currentStep: number;
};

function Stepper({ currentStep }: StepperProps) {
  const steps = ["Réservation", "Récapitulatif", "Confirmation"];

  return (
    <div className="stepper">
      {steps.map((step, index) => (
        <div key={step} className="stepper__item">
          <div
            className={`stepper__step ${
              currentStep >= index + 1 ? "stepper__step--active" : ""
            }`}
          >
            {index + 1}
          </div>

          <span className="stepper__label">{step}</span>
          {index < steps.length - 1 && (
            <div
              className={`stepper__line ${
                currentStep > index + 1 ? "stepper__line--active" : ""
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Stepper;
