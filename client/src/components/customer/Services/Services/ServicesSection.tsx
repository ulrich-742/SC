import "./ServicesSection.css";
import { FiScissors } from "react-icons/fi";
import { GiBeard } from "react-icons/gi";
import { PiHairDryer, PiSprayBottleLight } from "react-icons/pi";

function ServicesSection() {
  const services = [
    {
      id: 1,
      icon: <FiScissors />,
      label: "Coupe",
    },

    {
      id: 2,
      icon: <GiBeard />,
      label: "Barbe",
    },

    {
      id: 3,
      icon: <PiHairDryer />,
      label: "Coloration",
    },

    {
      id: 4,
      icon: <PiSprayBottleLight />,
      label: "Coiffure",
    },
  ];

  return (
    <section className="services">
      <h2 className="services__title">Nos services</h2>

      <div className="services__grid">
        {services.map((service) => (
          <div key={service.id} className="services__card">
            <div className="services__icon">{service.icon}</div>

            <span className="services__label">{service.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
