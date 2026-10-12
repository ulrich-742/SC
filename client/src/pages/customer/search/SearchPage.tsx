import { useEffect, useState } from "react";
import { FaMapPin } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router";
import BarberCard from "../../../components/customer/BarberCard/BarberCard";
import Search from "../../../components/search/Search";
import type { Barber } from "../../../types/barber";
import "./SearchPage.css";

function SearchPage() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleNearMe = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          if (!response.ok) {
            throw new Error("Erreur de géolocalisation");
          }

          const data = await response.json();
          const city =
            data.address.city ?? data.address.town ?? data.address.village;
          if (!city) {
            alert("Impossible de déterminer votre ville.");
            setIsNearMeActive(false);
            return;
          }

          const nearbyBarbers = barbers.filter(
            (barber) => barber.city.toLowerCase() === city.toLowerCase(),
          );

          setFilteredBarbers(nearbyBarbers);
          setIsNearMeActive(true);
        } catch (err) {
          console.error(err);
          alert("Impossible de récupérer votre position");
          setIsNearMeActive(false);
        }
      },

      (error) => {
        console.error(error);
        alert("Impossible d'obtenir votre position.");
        setIsNearMeActive(false);
      },
    );
  };

  useEffect(() => {
    fetch(`${API_URL}/api/barbers`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des coiffeurs");
        }

        return response.json();
      })
      .then((data: Barber[]) => {
        setBarbers(data);
      })
      .catch(() => {
        setError("Impossible de charger les coiffeurs pour le moment.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const searchedBarbers = barbers.filter((barber) => {
    const search = searchValue.toLowerCase();

    return (
      barber.name.toLowerCase().includes(search) ||
      barber.city.toLowerCase().includes(search)
    );
  });

  const displayedBarbers = isNearMeActive ? filteredBarbers : searchedBarbers;

  return (
    <main className="search">
      <label className="search-near__toggle">
        <input
          type="checkbox"
          checked={isNearMeActive}
          onChange={(e) => {
            const checked = e.target.checked;

            if (checked) {
              handleNearMe();
            } else {
              setIsNearMeActive(false);
              setFilteredBarbers([]);
            }
          }}
        />

        <span className="search-near__slider" />
        <FaMapPin className="search-near__icon" />

        <span className="search-near__text">Près de chez moi</span>
      </label>

      <div className="search__header">
        <button
          type="button"
          className="search-back__button"
          onClick={() => navigate(-1)}
        >
          <FiChevronLeft />
        </button>

        <h2 className="search-page__title">Rechercher</h2>

        <div className="search__spacer" />
      </div>

      <div className="search__bar">
        <Search value={searchValue} onChange={setSearchValue} />
      </div>

      {isNearMeActive && filteredBarbers.length === 0 && (
        <p className="search__empty">Aucun barber trouvé dans votre ville.</p>
      )}
      <div className="search__results">
        {!isLoading &&
          error == null &&
          displayedBarbers.map((barber) => (
            <BarberCard
              key={barber.id_user}
              barber={barber}
              onProfileClick={(selectedBarber) =>
                navigate("/booking", {
                  state: {
                    barber: selectedBarber,
                  },
                })
              }
            />
          ))}
      </div>
    </main>
  );
}

export default SearchPage;
