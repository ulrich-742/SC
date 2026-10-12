import { useEffect, useMemo, useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { useLocation } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import "./customerAvis.css";

const API_URL = import.meta.env.VITE_API_URL;

type SortOption = "recent" | "oldest";

type Review = {
  id_review: number;
  rating: number;
  comment: string;
  created_at: string;
  customer_firstname: string;
  customer_lastname: string;
  customer_avatar: string;
  prestation_name: string;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recent", label: "Plus récents" },
  { value: "oldest", label: "Plus anciens" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="customer-avis__stars">
      {[1, 2, 3, 4, 5].map((i) => {
        if (rating >= i)
          return (
            <FaStar
              key={i}
              className="customer-avis__star customer-avis__star--full"
            />
          );
        if (rating >= i - 0.5)
          return (
            <FaStarHalfAlt
              key={i}
              className="customer-avis__star customer-avis__star--full"
            />
          );
        return (
          <FaRegStar
            key={i}
            className="customer-avis__star customer-avis__star--empty"
          />
        );
      })}
    </span>
  );
}

function CustomerAvis() {
  const { user } = useAuth();
  const location = useLocation();
  const [sort, setSort] = useState<SortOption>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  // In barber context, use the logged-in barber's id
  // In customer context, expect barberId via location state
  const isBarberContext = location.pathname.startsWith("/barber");
  const barberId = isBarberContext ? user?.id : location.state?.barberId;

  useEffect(() => {
    if (!barberId) return;
    fetch(`${API_URL}/api/reviews/barber/${barberId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [barberId]);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === "recent")
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const distribution = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of reviews) {
      const star = Math.round(r.rating);
      if (star >= 1 && star <= 5) counts[star]++;
    }
    return [5, 4, 3, 2, 1].map((star) => ({ star, count: counts[star] }));
  }, [reviews]);

  const total = reviews.length;
  const average =
    total > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10,
        ) / 10
      : 0;

  return (
    <div className="customer-avis">
      {/* Titre */}
      <h1 className="customer-avis__page-title">
        Tous les avis et commentaires
      </h1>

      {/* Note moyenne */}
      <div className="customer-avis__summary">
        <div className="customer-avis__average">
          <p className="customer-avis__average-label">Note moyenne</p>
          <p className="customer-avis__average-score">{average}</p>
          <StarRating rating={average} />
          <p className="customer-avis__average-total">Basée sur {total} avis</p>
        </div>
        <div className="customer-avis__distribution">
          {distribution.map((d) => (
            <div key={d.star} className="customer-avis__bar-row">
              <span className="customer-avis__bar-star">
                {d.star}{" "}
                <FaStar className="customer-avis__star customer-avis__star--full" />
              </span>
              <div className="customer-avis__bar-track">
                <div
                  className="customer-avis__bar-fill"
                  style={{
                    width: total > 0 ? `${(d.count / total) * 100}%` : "0%",
                  }}
                />
              </div>
              <span className="customer-avis__bar-count">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tri */}
      <div className="customer-avis__recent-header">
        <h2 className="customer-avis__recent-title">Avis récents</h2>
        <div className="customer-avis__sort">
          <span className="customer-avis__sort-label">Trier par</span>
          <div className="customer-avis__sort-wrapper">
            <button
              type="button"
              className="customer-avis__sort-btn"
              onClick={() => setSortOpen((v) => !v)}
            >
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              <span className="customer-avis__sort-arrow">⌄</span>
            </button>
            {sortOpen && (
              <ul className="customer-avis__sort-dropdown">
                {SORT_OPTIONS.map((o) => (
                  <li key={o.value}>
                    <button
                      type="button"
                      className={`customer-avis__sort-option ${sort === o.value ? "customer-avis__sort-option--active" : ""}`}
                      onClick={() => {
                        setSort(o.value);
                        setSortOpen(false);
                      }}
                    >
                      {o.label}
                      {sort === o.value && <span>✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Liste des avis */}
      {total === 0 ? (
        <p className="customer-avis__empty">Aucun avis pour le moment.</p>
      ) : (
        <ul className="customer-avis__list">
          {sortedReviews.map((review) => (
            <li key={review.id_review} className="customer-avis__item">
              <img
                src={
                  `${API_URL}${review.customer_avatar}` ||
                  `https://api.dicebear.com/7.x/thumbs/svg?seed=${review.id_review}`
                }
                alt={`${review.customer_firstname} ${review.customer_lastname}`}
                className="customer-avis__avatar"
              />
              <div className="customer-avis__content">
                <div className="customer-avis__item-header">
                  <div>
                    <p className="customer-avis__name">
                      {review.customer_firstname} {review.customer_lastname}
                    </p>
                    <div className="customer-avis__rating-row">
                      <StarRating rating={review.rating} />
                      <span className="customer-avis__rating-value">
                        {review.rating}
                      </span>
                    </div>
                    <p className="customer-avis__prestation">
                      {review.prestation_name}
                    </p>
                  </div>
                  <div className="customer-avis__meta">
                    <span className="customer-avis__date">
                      {new Date(review.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button type="button" className="customer-avis__menu-btn">
                      <FiMoreVertical size={18} />
                    </button>
                  </div>
                </div>
                <p className="customer-avis__comment">{review.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomerAvis;
