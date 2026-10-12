import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiCalendar,
  FiCheck,
  FiClock,
  FiEdit2,
  FiEye,
  FiStar,
  FiXCircle,
} from "react-icons/fi";

import AdminFilterBar from "../../../components/admin/adminFilterBar/AdminFilterBar";
import EditEventModal from "../../../components/admin/editEventModal/EditEventModal";
import EventDetailCard from "../../../components/admin/eventDetailCard/EventDetailCard";
import StatsCard from "../../../components/admin/statsCard/StatsCard";
import UserDataGrid, {
  type DataGridColumn,
} from "../../../components/admin/userDataGrid/UserDataGrid";
import { useAuth } from "../../../context/AuthContext";
import { useAdminFilters } from "../../../hooks/useAdminFilter";

import type { Event } from "../../../types/event";

import "./EventDash.css";
import Swal from "sweetalert2";

const API_URL = import.meta.env.VITE_API_URL;

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return `${text.slice(0, maxLength)}...`;
  }
  return text;
};

type DashboardEvent = Event & { id: number };

function EventDash() {
  const { fetchWithAuth } = useAuth();

  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DashboardEvent | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<DashboardEvent | null>(null);

  const fetchEvents = useCallback(() => {
    fetch(`${API_URL}/api/events`)
      .then((res) => res.json())
      .then((data: Event[]) => {
        const formattedData = data.map((item) => ({
          ...item,
          id: item.id_event,
        }));
        setEvents(formattedData);
      })
      .catch((err) => console.error("Erreur fetch:", err));
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleOpenCreateModal = () => {
    setEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: DashboardEvent) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEventToEdit(null);
  };

  const handleSaveEvent = async (formData: FormData) => {
    try {
      const isEditing = eventToEdit !== null;
      const url = isEditing
        ? `${API_URL}/api/admin/events/${eventToEdit.id_event}`
        : `${API_URL}/api/admin/events`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde de l'événement");
      }

      Swal.fire({
        icon: "success",
        title: "Succès !",
        text: isEditing
          ? "L'événement a été mis à jour."
          : "L'événement a été créé.",
        timer: 2000,
        showConfirmButton: false,
      });

      handleCloseModal();
      fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error("Erreur backend:", error);

      Swal.fire({
        icon: "error",
        title: "Oups...",
        text: "Une erreur est survenue lors de la sauvegarde.",
      });
    }
  };

  const handleDeleteEvent = async (event: DashboardEvent) => {
    const result = await Swal.fire({
      title: "Supprimer définitivement ?",
      text: `Cette action est irréversible et supprimera l'événement "${event.title}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) return;

    try {
      const url = `${API_URL}/api/admin/events/${event.id_event}`;

      const response = await fetchWithAuth(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'événement");
      }

      Swal.fire({
        icon: "success",
        title: "Supprimé !",
        text: "L'événement a été supprimé avec succès.",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchEvents();
      setSelectedEvent(null);
    } catch (error) {
      console.error("Erreur backend lors de la suppression :", error);

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de la suppression.",
      });
    }
  };
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
  } = useAdminFilters<DashboardEvent>(
    events,
    ["title", "description", "location"],
    "start_date",
  );

  const uniqueStatus = useMemo(() => {
    const statusList = events
      .map((e) => (e.status as string) || "")
      .filter((s) => s.trim() !== "");
    return Array.from(new Set(statusList)).sort();
  }, [events]);

  const locationOptions = useMemo(() => {
    const places = events.map((e) => (e.location as string) || "");
    return Array.from(new Set(places)).sort();
  }, [events]);

  const totalCount = events.length;
  const publishedCount = events.filter((e) => e.status === "publié").length;
  const plannedCount = events.filter((e) => e.status === "annulé").length;
  const draftCount = events.filter((e) => e.status === "brouillon").length;
  const finishedCount = events.filter((e) => e.status === "terminé").length;

  const columns: DataGridColumn<DashboardEvent>[] = [
    {
      key: "title",
      header: "Titre",
      render: (event) => (
        <div className="user-grid-info">{truncateText(event.title, 30)}</div>
      ),
    },
    {
      key: "status",
      header: "Statut",
      render: (event) => (
        <div className={`user-grid-info status-${event.status?.toLowerCase()}`}>
          {event.status}
        </div>
      ),
    },
    {
      key: "start_date",
      header: "Date de début",
      render: (event) => (
        <div className="user-grid-info">
          {format(new Date(event.start_date), "dd MMM yyyy", {
            locale: fr,
          })}
          <b />
          {format(new Date(event.start_date), "HH:mm", {
            locale: fr,
          })}
        </div>
      ),
    },
    {
      key: "end_date",
      header: "Date de fin",
      render: (event) => (
        <div className="user-grid-info">
          {format(new Date(event.end_date), "dd MMM yyyy", {
            locale: fr,
          })}
          <b />
          {format(new Date(event.end_date), "HH:mm", {
            locale: fr,
          })}
        </div>
      ),
    },
    {
      key: "location",
      header: "Lieu",
      render: (event) => (
        <div className="user-grid-info">{truncateText(event.location, 35)}</div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (event) => (
        <div className="user-grid-actions-cell">
          <button
            type="button"
            className="user-grid-icon-btn"
            onClick={() => {
              setEventToEdit(event);
              setIsModalOpen(true);
            }}
            title="Voir"
          >
            <FiEye />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="eventDash-body">
      <header className="eventDash-header">
        <div className="eventDash-title">
          <FiStar className="eventDash-title-icon" />
          <h1>Événements</h1>
        </div>
        <p>Gérez et planifiez vos événements pour vos coiffeurs.</p>

        <div className="eventDash-top-graphs">
          <StatsCard
            Icon={FiCalendar}
            iconColor="icon-info"
            title="Événements"
            value={totalCount}
            cycle="Total"
          />
          <StatsCard
            Icon={FiClock}
            iconColor="icon-warning"
            title="Brouillons"
            value={draftCount}
            cycle="Total"
          />
          <StatsCard
            Icon={FiCheck}
            iconColor="icon-success"
            title="Publiés"
            value={publishedCount}
            cycle="Total"
          />
          <StatsCard
            Icon={FiXCircle}
            iconColor="icon-error"
            title="Annulés"
            value={plannedCount}
            cycle="Total"
          />
          <StatsCard
            Icon={FiXCircle}
            iconColor="icon-info"
            title="Terminés"
            value={finishedCount}
            cycle="Total"
          />
        </div>
        <button
          className="btn-add-event"
          type="button"
          onClick={handleOpenCreateModal}
        >
          <FiEdit2 /> Créer un événement
        </button>
      </header>

      <main className="eventDash-main">
        <section className="eventDash-section">
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
          />

          <UserDataGrid
            columns={columns}
            data={filteredData}
            onRowClick={(event) => setSelectedEvent(event)}
            rowsPerPage={7}
            selectedId={selectedEvent?.id_event}
          />
        </section>

        <aside className="eventDash-aside">
          <EventDetailCard
            selectedEvent={selectedEvent}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteEvent}
          />
        </aside>
      </main>

      <EditEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={eventToEdit}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}

export default EventDash;
