import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiAlertTriangle, FiMessageSquare, FiStar } from "react-icons/fi";
import Swal from "sweetalert2";

import AdminFilterBar from "../../../components/admin/adminFilterBar/AdminFilterBar";
import ReviewDetailCard from "../../../components/admin/reviewDetailCard/ReviewDetailCard";
import StatsCard from "../../../components/admin/statsCard/StatsCard";
import UserDataGrid, {
  type DataGridColumn,
} from "../../../components/admin/userDataGrid/UserDataGrid";
import { useAuth } from "../../../context/AuthContext";
import { useAdminFilters } from "../../../hooks/useAdminFilter";

import type { AdminReview } from "../../../types/review";
import "./ReviewDash.css";

type LocalAdminReview = AdminReview & {
  id: number;
  create_time: string;
  status: string;
  location_type: string;
};
const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder-image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
};
function ReviewDash() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { fetchWithAuth } = useAuth();

  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  const thisMonthRange = {
    start: format(thirtyDaysAgo, "yyyy-MM-dd"),
    end: format(today, "yyyy-MM-dd"),
  };
  const params = `?startDate=${thisMonthRange.start}&endDate=${thisMonthRange.end}`;

  const [reviews, setReviews] = useState<LocalAdminReview[]>([]);
  const [monthlyNewReviews, setMonthlyNewReviews] = useState<AdminReview[]>([]);

  const [selectedReview, setSelectedReview] = useState<LocalAdminReview | null>(
    null,
  );

  const loadReviewsData = useCallback(() => {
    fetchWithAuth(`${API_URL}/api/admin/reviewsdetails`)
      .then((res) => res.json())
      .then((data: AdminReview[]) => {
        const formattedData = data.map((app: AdminReview) => ({
          ...app,
          id: app.id_review,
          create_time: app.created_at,
          status: app.appointment_status,
          location_type: app.appointment_location_type,
        })) as LocalAdminReview[];

        const sortedData = [...formattedData].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setReviews(formattedData);

        if (sortedData.length > 0) {
          setSelectedReview((prev) => {
            if (prev) {
              const current = formattedData.find(
                (a) => a.id_review === prev.id_review,
              );
              return current || sortedData[0];
            }
            return sortedData[0];
          });
        }
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des avis :", err),
      );

    fetchWithAuth(`${API_URL}/api/admin/reviewsdetails${params}`)
      .then((res) => res.json())
      .then((data: AdminReview[]) => setMonthlyNewReviews(data))
      .catch((err) => console.error("Erreur lors du fetch mensuel :", err));
  }, [params, fetchWithAuth]);

  useEffect(() => {
    loadReviewsData();
  }, [loadReviewsData]);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateSortOrder,
    setDateSortOrder,
    filteredData,
    locationFilter,
    setLocationFilter,
    sortField,
    setSortField,
  } = useAdminFilters<LocalAdminReview>(reviews, [
    "barber_name",
    "customer_firstname",
    "customer_lastname",
    "prestation_name",
  ]);

  const uniqueStatus = useMemo(() => {
    const statusList = reviews
      .map((a) => a.appointment_status || "")
      .filter((s) => s.trim() !== "");
    if (reviews.some((review) => review.reporting === 1)) {
      statusList.push("signaler");
    }
    return Array.from(new Set(statusList)).sort();
  }, [reviews]);

  const locationOptions = useMemo(() => {
    const place = reviews.map((p) =>
      p.appointment_location_type ? p.appointment_location_type : "",
    );
    return Array.from(new Set(place)).sort();
  }, [reviews]);

  const reportingCount = useMemo(
    () => reviews.filter((r) => r.reporting === 1).length,
    [reviews],
  );

  const monthlyAverageRation = useMemo(() => {
    if (!monthlyNewReviews || monthlyNewReviews.length === 0) return 0;
    return (
      monthlyNewReviews.reduce((sum, r) => sum + r.rating, 0) /
      monthlyNewReviews.length
    ).toFixed(1);
  }, [monthlyNewReviews]);

  const averageRate = useMemo(() => {
    if (!reviews || reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1);
  }, [reviews]);
  const handleDeleteReview = async () => {
    const result = await Swal.fire({
      title: "Supprimer définitivement ?",
      text: "Cette action est irréversible et supprimera toutes les données liées.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetchWithAuth(
        `${API_URL}/api/admin/reviews/${selectedReview?.id_review}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      Swal.fire({
        icon: "success",
        title: "Supprimé !",
        text: "L'élément a été supprimé avec succès.",
        timer: 2000,
        showConfirmButton: false,
      });
      loadReviewsData();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Erreur",
        "Une erreur est survenue lors de la suppression.",
        "error",
      );
    }
  };
  const columns: DataGridColumn<LocalAdminReview>[] = [
    {
      key: "barber_name",
      header: "Coiffeur",
      render: (review) => (
        <div className="user-grid-user-cell">
          <img
            src={getImageUrl(review.barber_avatar_url)}
            alt={review.barber_name}
            className="user-grid-avatar"
          />
          <div className="user-grid-info">{review.barber_name}</div>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Client",
      render: (review) => (
        <div className="user-grid-user-cell">
          <img
            src={getImageUrl(review.customer_avatar_url)}
            alt={review.customer_firstname}
            className="user-grid-avatar"
          />
          <div className="user-grid-info">
            {review.customer_firstname} {review.customer_lastname}
          </div>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Note",
      render: (review) => (
        <div className="user-grid-info">
          {review.rating} <FiStar />
        </div>
      ),
    },
    {
      key: "create_time",
      header: "Date de l'avis",
      render: (review) => (
        <div className="user-grid-info">
          {format(new Date(review.created_at), "dd MMMM yyyy", {
            locale: fr,
          })}
        </div>
      ),
    },
    {
      key: "reporting",
      header: "Signalement",
      render: (review) => (
        <div className={`user-grid-info reporting-${review.reporting}`}>
          {review.reporting === 1 ? "oui" : "non"}
        </div>
      ),
    },
    {
      key: "prestation",
      header: "Service",
      render: (review) => (
        <div className="user-grid-info">
          {truncateText(review.prestation_name, 20)}
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut rdv",
      render: (review) => (
        <div
          className={`user-grid-info status-${review.appointment_status?.toLowerCase()}`}
        >
          {review.appointment_status}
        </div>
      ),
    },
    {
      key: "localisation",
      header: "Lieu",
      render: (review) => (
        <div
          className={`user-grid-info location-${review.appointment_location_type?.toLowerCase()}`}
        >
          {review.appointment_location_type}
        </div>
      ),
    },
  ];

  return (
    <div className="reviewDash-body">
      <header className="reservationsDash-header">
        <div className="reservationsDash-title">
          <FiMessageSquare className="reservationsDash-title-icon" />
          <h1>Gestion des Avis & Commentaires</h1>
        </div>
        <p>Gérez et suivez les avis & commentaires de votre plateforme</p>

        <div className="reservationsDash-top-graphs">
          <StatsCard
            Icon={FiMessageSquare}
            iconColor="icon-info"
            title="Avis"
            value={reviews.length}
            cycle="Total"
          />
          <StatsCard
            Icon={FiStar}
            iconColor="icon-success"
            title="Note moyenne"
            value={`${averageRate}/5`}
            cycle="Total"
          />
          <StatsCard
            Icon={FiAlertTriangle}
            iconColor="icon-error"
            title="Signalements"
            value={reportingCount}
            cycle="Total"
          />
          <StatsCard
            Icon={FiStar}
            iconColor="icon-success"
            title="Note moyenne"
            value={`${monthlyAverageRation}/5`}
            cycle="Les 30 derniers jours"
          />
          <StatsCard
            Icon={FiMessageSquare}
            iconColor="icon-info"
            title="Avis"
            value={monthlyNewReviews.length}
            cycle="Les 30 derniers jours"
          />
        </div>
      </header>

      <main className="reservationsDash-main">
        <section className="reservationsDash-section">
          <AdminFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateSortOrder={dateSortOrder}
            setDateSortOrder={setDateSortOrder}
            status={uniqueStatus}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            location={locationOptions}
            locationPlaceholder="Tous les lieux"
            sortField={sortField}
            onSortFieldChange={setSortField}
          />

          <UserDataGrid
            columns={columns}
            data={filteredData}
            onRowClick={(review) => setSelectedReview(review)}
            rowsPerPage={9}
            selectedId={selectedReview?.id}
          />
        </section>

        <aside className="reviewDash-aside">
          {selectedReview ? (
            <ReviewDetailCard
              selectedReview={selectedReview}
              handleDeleteReview={handleDeleteReview}
            />
          ) : (
            <div className="no-user-selected">
              <p>Sélectionnez une réservation pour voir ses détails</p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default ReviewDash;
