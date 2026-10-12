import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiCheck, FiEye, FiPause, FiScissors } from "react-icons/fi";

import AdminFilterBar from "../../../components/admin/adminFilterBar/AdminFilterBar";
import EditUserModal from "../../../components/admin/editUserModal/EditUserModal";
import StatsCard from "../../../components/admin/statsCard/StatsCard";
import UserDataGrid, {
  type DataGridColumn,
} from "../../../components/admin/userDataGrid/UserDataGrid";
import UserProfilCard from "../../../components/admin/userProfilCard/UserProfilCard";
import { useAuth } from "../../../context/AuthContext";
import { useAdminFilters } from "../../../hooks/useAdminFilter";
import { useEntityActions } from "../../../hooks/useEntityActions";
import type { Appointment } from "../../../types/appointment";
import type { Barber } from "../../../types/barber";
import type { Review } from "../../../types/review";

import "./Barber.css";

const API_URL = import.meta.env.VITE_API_URL;
const today = new Date();
const thirtyDaysAgo = subDays(today, 30);
const thisMonthRange = {
  start: format(thirtyDaysAgo, "yyyy-MM-dd"),
  end: format(today, "yyyy-MM-dd"),
};
const params = `?startDate=${thisMonthRange.start}&endDate=${thisMonthRange.end}`;
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder-image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
};
function Barbers() {
  const { fetchWithAuth } = useAuth();
  const [barbers, setBarbers] = useState<(Barber & { id: number })[]>([]);
  const [monthlyNewBarbers, setMonthlyNewBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<
    (Barber & { id: number }) | null
  >(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadAllData = useCallback(() => {
    fetchWithAuth(`${API_URL}/api/admin/barbers`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data: Barber[]) => {
        const formattedData = data.map((item) => ({
          ...item,
          id: item.id_user,
        }));
        const sortedData = [...formattedData].sort(
          (a, b) =>
            new Date(b.create_time).getTime() -
            new Date(a.create_time).getTime(),
        );
        setBarbers(formattedData);
        if (sortedData.length > 0) {
          setSelectedBarber((prev) => {
            if (prev) {
              const current = formattedData.find(
                (c) => c.id_user === prev.id_user,
              );
              return current || sortedData[0];
            }
            return sortedData[0];
          });
        }
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des clients :", err),
      );
    fetchWithAuth(`${API_URL}/api/admin/reviews`)
      .then((res) => res.json())
      .then((data: Review[]) => setReviews(data))
      .catch((err) => console.error("Erreur lors du fetch des avis :", err));
    fetchWithAuth(`${API_URL}/api/admin/appointments`)
      .then((res) => res.json())
      .then((data: Appointment[]) => setAppointments(data))
      .catch((err) => console.error("Erreur lors du fetch mensuel:", err));
    fetchWithAuth(`${API_URL}/api/admin/barbers${params}`)
      .then((res) => res.json())
      .then((data: Barber[]) => setMonthlyNewBarbers(data))
      .catch((err) => console.error("Erreur lors du fetch mensuel:", err));
  }, [fetchWithAuth]);

  const {
    searchTerm,
    setSearchTerm,
    locationFilter,
    setLocationFilter,
    statusFilter,
    setStatusFilter,
    dateSortOrder,
    setDateSortOrder,
    filteredData,
  } = useAdminFilters<Barber & { id: number }>(barbers, ["name"]);

  const { handleSave, handleToggleSuspend, deleteUser } = useEntityActions<
    Barber & { id: number }
  >({
    apiBase: API_URL,
    idField: "api/admin/barbers",
    onActionComplete: loadAllData,
    onClose: () => setIsEditModalOpen(false),
  });

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const suspendedBarbersCount = useMemo(() => {
    return barbers.filter((b) => b.status?.toLowerCase() === "suspendu").length;
  }, [barbers]);
  const pendingBarbersCount = useMemo(() => {
    return barbers.filter((b) => b.status?.toLowerCase() === "en attente")
      .length;
  }, [barbers]);
  const selectedBarberStats = useMemo(() => {
    if (!selectedBarber)
      return {
        gridValue1: 0,
        gridValue2: 0,
        gridValue3: 0,
        gridValue4: 0,
        gridTitle1: "",
        gridTitle2: "",
        gridTitle3: "",
        gridTitle4: "",
      };
    const barberApps = appointments.filter(
      (app) => app.id_user_barber === selectedBarber.id_user,
    );
    const barberAppIds = barberApps.map((app) => app.id_appointment);
    const barberReviews = reviews.filter((rev) =>
      barberAppIds.includes(rev.id_appointment),
    );
    const gridTitle1 = "Réservation";
    const gridValue1 = barberApps.length;
    const gridTitle2 = "Réservation annulé";
    const gridValue2 = barberApps.filter(
      (app) => app.status === "annulé",
    ).length;
    const gridTitle3 = "Avis reçu";
    const gridValue3 = barberReviews.length;
    const gridTitle4 = "Signalemments";
    const gridValue4 = barberReviews.filter(
      (rev) => rev.reporting === 1,
    ).length;
    return {
      gridValue1,
      gridValue2,
      gridValue3,
      gridValue4,
      gridTitle1,
      gridTitle2,
      gridTitle3,
      gridTitle4,
    };
  }, [selectedBarber, appointments, reviews]);

  const uniqueDepartments = useMemo(() => {
    const depts = barbers
      .map((b) => (b.postal_code ? b.postal_code.substring(0, 2) : ""))
      .filter((dept) => dept.length === 2);
    return Array.from(new Set(depts)).sort();
  }, [barbers]);

  const uniqueStatus = useMemo(() => {
    const statusList = barbers
      .map((b) => b.status || "")
      .filter((s) => s.trim() !== "");
    return Array.from(new Set(statusList)).sort();
  }, [barbers]);

  const columns: DataGridColumn<Barber & { id: number }>[] = [
    {
      key: "name",
      header: "Coiffeur",
      render: (barber) => (
        <div className="user-grid-client-cell">
          <img
            src={getImageUrl(barber.avatar_url)}
            alt={barber.name}
            className="user-grid-avatar"
          />
          <div className="user-grid-info">
            <span className="user-grid-fullname">{barber.name}</span>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (barber) => <div className="user-grid-info">{barber.email}</div>,
    },
    {
      key: "city",
      header: "Ville",
      render: (barber) => <div className="user-grid-info">{barber.city}</div>,
    },
    {
      key: "postal_code",
      header: "Code postal",
      render: (barber) => (
        <div className="user-grid-info">{barber.postal_code}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (barber) => (
        <div
          className={`user-grid-info status-${barber.status?.toLowerCase()}`}
        >
          {barber.status}
        </div>
      ),
    },
    {
      key: "create_time",
      header: "Date de création",
      render: (barber) => (
        <div className="user-grid-info">
          {format(new Date(barber.create_time), "dd MMM yyyy", {
            locale: fr,
          })}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (barber) => (
        <div className="user-grid-actions-cell">
          <button
            type="button"
            className="user-grid-icon-btn"
            onClick={() => {
              setSelectedBarber(barber);
              setIsEditModalOpen(true);
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
    <div className="admin-barbers-body">
      <header className="admin-barbers-header">
        <div className="admin-barbers-title">
          <FiScissors className="admin-barbers-title-icon" />
          <h1>Gestion des coiffeurs</h1>
        </div>
        <p>Gérez et suivez les Coiffeurs de votre plateforme</p>
      </header>
      <main className="admin-barbers-main">
        <section className="admin-barbers-main-left">
          <div className="admin-barbers-body-stats">
            <StatsCard
              Icon={FiScissors}
              title="Coiffeurs"
              value={barbers.length}
              cycle="Total"
            />
            <StatsCard
              Icon={FiScissors}
              iconColor="icon-success"
              title="Nouveaux coiffeurs"
              value={monthlyNewBarbers.length}
              cycle="Les 30 derniers jours"
            />
            <StatsCard
              Icon={FiPause}
              iconColor="icon-error"
              title="Coiffeurs suspendus"
              value={suspendedBarbersCount}
              cycle="Total"
            />
            <StatsCard
              Icon={FiCheck}
              iconColor="icon-warning"
              title="Coiffeurs en attente"
              value={pendingBarbersCount}
              cycle="Total"
            />
          </div>
          <AdminFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateSortOrder={dateSortOrder}
            setDateSortOrder={setDateSortOrder}
            location={uniqueDepartments}
            status={uniqueStatus}
          />
          <div>
            <UserDataGrid
              columns={columns}
              data={filteredData}
              onRowClick={(barber) => setSelectedBarber(barber)}
              rowsPerPage={6}
              selectedId={selectedBarber?.id}
            />
          </div>
        </section>
        <aside className="admin-barbers-main-aside">
          {selectedBarber ? (
            <UserProfilCard
              selectedUser={selectedBarber}
              selectedUserStats={selectedBarberStats}
              onEditClick={() => setIsEditModalOpen(true)}
              onToggleSuspendClick={() => handleToggleSuspend(selectedBarber)}
              deleteUser={() => deleteUser(selectedBarber)}
            />
          ) : (
            <div className="no-user-selected">
              <p>Sélectionnez un utilisateur pour voir son profil</p>
            </div>
          )}
        </aside>
      </main>
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedBarber}
        onSave={handleSave}
        onToggleSuspend={handleToggleSuspend}
        deleteUser={() => {
          if (selectedBarber) {
            deleteUser(selectedBarber);
          }
        }}
      />
    </div>
  );
}

export default Barbers;
