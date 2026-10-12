import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiCalendar, FiCheck, FiClock, FiXCircle } from "react-icons/fi";

import AdminFilterBar from "../../../components/admin/adminFilterBar/AdminFilterBar";
import ReservationDetailCard from "../../../components/admin/reservationDetailCard/ReservationDetailCard";
import StatsCard from "../../../components/admin/statsCard/StatsCard";
import UserDataGrid, {
  type DataGridColumn,
} from "../../../components/admin/userDataGrid/UserDataGrid";
import { useAuth } from "../../../context/AuthContext";
import { useAdminFilters } from "../../../hooks/useAdminFilter";

import type { Appointment } from "../../../types/appointment";
import "./ReservationsDash.css";
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
function ReservationsDash() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { fetchWithAuth } = useAuth();

  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  const thisMonthRange = {
    start: format(thirtyDaysAgo, "yyyy-MM-dd"),
    end: format(today, "yyyy-MM-dd"),
  };
  const params = `?startDate=${thisMonthRange.start}&endDate=${thisMonthRange.end}`;

  const [appointments, setAppointments] = useState<
    (Appointment & { id: number; create_time: string })[]
  >([]);
  const [monthlyNewAppointments, setMonthlyNewAppointments] = useState<
    Appointment[]
  >([]);
  const [selectedReservation, setSelectedReservation] = useState<
    (Appointment & { id: number; create_time: string }) | null
  >(null);

  const loadAppointmentsData = useCallback(() => {
    fetchWithAuth(`${API_URL}/api/admin/appointmentsdetails`)
      .then((res) => res.json())
      .then((data: Appointment[]) => {
        const formattedData = data.map((app: Appointment) => ({
          ...app,
          id: app.id_appointment,
        }));
        const sortedData = [...formattedData].sort(
          (a, b) =>
            new Date(b.create_time).getTime() -
            new Date(a.create_time).getTime(),
        );
        setAppointments(formattedData);

        if (sortedData.length > 0) {
          setSelectedReservation((prev) => {
            if (prev) {
              const current = formattedData.find(
                (a) => a.id_appointment === prev.id_appointment,
              );
              return current || sortedData[0];
            }
            return sortedData[0];
          });
        }
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des réservations :", err),
      );

    fetchWithAuth(`${API_URL}/api/admin/appointments${params}`)
      .then((res) => res.json())
      .then((data: Appointment[]) => setMonthlyNewAppointments(data))
      .catch((err) => console.error("Erreur lors du fetch mensuel :", err));
  }, [params, fetchWithAuth]);

  useEffect(() => {
    loadAppointmentsData();
  }, [loadAppointmentsData]);

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
  } = useAdminFilters<Appointment & { id: number; create_time: string }>(
    appointments,
    [
      "barber_name",
      "customer_firstname",
      "customer_lastname",
      "appointment_date",
      "create_time",
    ],
  );

  const uniqueStatus = useMemo(() => {
    const statusList = appointments
      .map((a) => a.status || "")
      .filter((s) => s.trim() !== "");
    return Array.from(new Set(statusList)).sort();
  }, [appointments]);

  const locationOptions = useMemo(() => {
    const place = appointments.map((p) =>
      p.location_type ? p.location_type : "",
    );
    return Array.from(new Set(place)).sort();
  }, [appointments]);

  const pendingCount = useMemo(
    () =>
      appointments.filter((a) => a.status?.toLowerCase() === "en attente")
        .length,
    [appointments],
  );
  const cancelCount = useMemo(
    () =>
      appointments.filter((a) => a.status?.toLowerCase() === "annulé").length,
    [appointments],
  );
  const confirmCount = useMemo(
    () =>
      appointments.filter((a) => a.status?.toLowerCase() === "confirmé").length,
    [appointments],
  );

  const columns: DataGridColumn<
    Appointment & { id: number; create_time: string }
  >[] = [
    {
      key: "barber_name",
      header: "Coiffeur",
      render: (appointment) => (
        <div className="user-grid-user-cell">
          <img
            src={getImageUrl(appointment.barber_avatar)}
            alt={appointment.barber_name}
            className="user-grid-avatar"
          />
          <div className="user-grid-info">{appointment.barber_name}</div>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Client",
      render: (appointment) => (
        <div className="user-grid-user-cell">
          <img
            src={getImageUrl(appointment.customer_avatar)}
            alt={appointment.customer_firstname}
            className="user-grid-avatar"
          />
          <div className="user-grid-info">
            {appointment.customer_firstname} {appointment.customer_lastname}
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date & Heure",
      render: (appointment) => (
        <div className="user-grid-info">
          {format(new Date(appointment.appointment_date), "HH:mm", {
            locale: fr,
          })}
          <b />
          {format(new Date(appointment.appointment_date), "dd MMMM yyyy", {
            locale: fr,
          })}
        </div>
      ),
    },
    {
      key: "prestation",
      header: "Service",
      render: (appointment) => (
        <div className="user-grid-info">
          {truncateText(appointment.prestation_name, 20)}
        </div>
      ),
    },
    {
      key: "create_time",
      header: "Date de création",
      render: (appointment) => (
        <div className="user-grid-info">
          {format(new Date(appointment.create_time), "HH:mm", {
            locale: fr,
          })}
          <b />
          {format(new Date(appointment.create_time), "dd MMMM yyyy", {
            locale: fr,
          })}
        </div>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (appointment) => (
        <div
          className={`user-grid-info status-${appointment.status?.toLowerCase()}`}
        >
          {appointment.status}
        </div>
      ),
    },
    {
      key: "localisation",
      header: "Lieu",
      render: (appointment) => (
        <div
          className={`user-grid-info location-${appointment.location_type?.toLowerCase()}`}
        >
          {appointment.location_type}
        </div>
      ),
    },
  ];

  return (
    <div className="reservationsDash-body">
      <header className="reservationsDash-header">
        <div className="reservationsDash-title">
          <FiCalendar className="reservationsDash-title-icon" />
          <h1>Gestion des réservations</h1>
        </div>
        <p>Gerez et suivez les réservations de votre plateforme</p>

        <div className="reservationsDash-top-graphs">
          <StatsCard
            Icon={FiCalendar}
            iconColor="icon-info"
            title="Réservations"
            value={appointments.length}
            cycle="Total"
          />
          <StatsCard
            Icon={FiCheck}
            iconColor="icon-success"
            title="Confirmées"
            value={confirmCount}
            cycle="Total"
          />
          <StatsCard
            Icon={FiClock}
            iconColor="icon-warning"
            title="En attente"
            value={pendingCount}
            cycle="Total"
          />
          <StatsCard
            Icon={FiXCircle}
            iconColor="icon-error"
            title="Annulées"
            value={cancelCount}
            cycle="Total"
          />
          <StatsCard
            Icon={FiCalendar}
            iconColor="icon-info"
            title="Réservations"
            value={monthlyNewAppointments.length}
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
            onRowClick={(appointment) => setSelectedReservation(appointment)}
            rowsPerPage={7}
            selectedId={selectedReservation?.id}
          />
        </section>

        <aside className="reservationsDash-aside">
          {selectedReservation ? (
            <ReservationDetailCard selectedReservation={selectedReservation} />
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

export default ReservationsDash;
