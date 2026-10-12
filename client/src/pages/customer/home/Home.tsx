import { useState } from "react";
import "./Home.css";
import { FiMapPin, FiScissors } from "react-icons/fi";
import { Link } from "react-router";
import Carrousel from "../../../components/carrousel/Carrousel";
import ServicesSection from "../../../components/customer/Services/Services/ServicesSection";
import EventBanner from "../../../components/event/EventBanner";
import Search from "../../../components/search/Search";
import useBarbers from "../../../hooks/useBarbers";
import useEvents from "../../../hooks/useEvents";

function Home() {
  const events = useEvents();
  const event = events[0];
  const barbers = useBarbers();

  const [searchValue, setSearchValue] = useState("");

  const filteredBarbers = barbers.filter((barber) => {
    const search = searchValue.toLowerCase();
    return (
      barber.name.toLowerCase().includes(search) ||
      barber.city.toLowerCase().includes(search)
    );
  });

  const eventProps = event
    ? {
        label: "ÉVÉNEMENT",
        title: event.title,
        subtitle: "",
        description: event.description,
        date: event.start_date,
        location: event.location,
        image: event.image_url,
      }
    : null;

  return (
    <div className="home">
      
      <div className="home__hero">
        <div className="home__hero-left">
          
          <div className="home__header-row">
            <div className="home__brand">
              <div className="home__logo-icon">
                <FiScissors />
              </div>
              <span className="home__brand-name">Secare</span>
            </div>
          </div>

         
          <p className="home__eyebrow">SALONS & BARBIERS PRÈS DE CHEZ VOUS</p>

          <h1 className="home__title">
            Trouvez votre coiffeur <span className="home_span">idéal</span>
          </h1>

          <p className="home__subtitle-text">
            Comparez les meilleurs salons, consultez les avis et réservez votre
            créneau en quelques secondes.
          </p>

         
          <div className="home_search">
            <Search value={searchValue} onChange={setSearchValue} />
          </div>

          {/* Desktop : recherche étendue */}
          <div className="home__search-desktop">
            <div className="home__search-desktop-field">
              <FiMapPin className="home__search-desktop-icon" />
              <input
                type="text"
                placeholder="Ville ou adresse"
                className="home__search-desktop-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <button type="button" className="home__search-desktop-btn">
              Rechercher
            </button>
          </div>

          {/* Desktop : statistiques */}
          <div className="home__stats">
            <div className="home__stat">
              <strong>1 200+</strong>
              <span>salons partenaires</span>
            </div>
            <div className="home__stat-sep" />
            <div className="home__stat">
              <strong>4,9/5</strong>
              <span>note moyenne</span>
            </div>
            <div className="home__stat-sep" />
            <div className="home__stat">
              <strong>60 s</strong>
              <span>pour réserver</span>
            </div>
          </div>
        </div>

        {/* Desktop : colonne droite — EventBanner */}
        <div className="home__hero-right">
          {eventProps && <EventBanner {...eventProps} />}
        </div>
      </div>

      {/* Mobile : banner événement (caché sur desktop) */}
      <section className="home__banner">
        {eventProps && <EventBanner {...eventProps} />}
      </section>

      {/* Section coiffeurs populaires */}
      <section className="home__section">
        <div className="home__section-header">
          <div>
            <h2 className="home__section-title">Coiffeurs populaires</h2>
            <p className="home__section-subtitle">
              Les salons les mieux notés près de vous.
            </p>
          </div>
          <Link to="/search" className="home__voir-tout">
            Voir tout →
          </Link>
        </div>
        <Carrousel barbers={filteredBarbers} />
      </section>

      <ServicesSection />
    </div>
  );
}

export default Home;
