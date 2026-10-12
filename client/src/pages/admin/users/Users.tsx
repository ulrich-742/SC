import { format, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiCalendar, FiEye, FiPause, FiUserPlus } from "react-icons/fi";

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
import type { Customer } from "../../../types/Customer";
import type { Review } from "../../../types/review";

import "./Users.css";

const API_URL = import.meta.env.VITE_API_URL;
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder-image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
};
const today = new Date();
const thirtyDaysAgo = subDays(today, 30);
const thisMonthRange = {
  start: format(thirtyDaysAgo, "yyyy-MM-dd"),
  end: format(today, "yyyy-MM-dd"),
};
const params = `?startDate=${thisMonthRange.start}&endDate=${thisMonthRange.end}`;

function Users() {
  const { fetchWithAuth } = useAuth();
  const [customers, setCustomers] = useState<(Customer & { id: number })[]>([]);
  const [monthlyNewUsers, setMonthlyNewUsers] = useState<Customer[]>([]);
  const [monthlyAppointments, setMonthlyAppointments] = useState<Appointment[]>(
    [],
  );
  const [selectedCustomer, setSelectedCustomer] = useState<
    (Customer & { id: number }) | null
  >(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadAllData = useCallback(() => {
    fetchWithAuth(`${API_URL}/api/admin/customers`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur réseau");
        return res.json();
      })
      .then((data: Customer[]) => {
        const formattedData = data.map((item) => ({
          ...item,
          id: item.id_user,
        }));
        const sortedData = [...formattedData].sort(
          (a, b) =>
            new Date(b.create_time).getTime() -
            new Date(a.create_time).getTime(),
        );
        setCustomers(formattedData);
        if (sortedData.length > 0) {
          setSelectedCustomer((prev) => {
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

    fetchWithAuth(`${API_URL}/api/admin/customers${params}`)
      .then((res) => res.json())
      .then((data: Customer[]) => setMonthlyNewUsers(data))
      .catch((err) => console.error("Erreur lors du fetch mensuel:", err));

    fetchWithAuth(`${API_URL}/api/admin/appointments${params}`)
      .then((res) => res.json())
      .then((data: Appointment[]) => setMonthlyAppointments(data))
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
  } = useAdminFilters<Customer & { id: number }>(customers, [
    "firstname",
    "lastname",
  ]);

  const { handleSave, handleToggleSuspend, deleteUser } = useEntityActions<
    Customer & { id: number }
  >({
    apiBase: API_URL,
    idField: "api/admin/customers",
    onActionComplete: loadAllData,
    onClose: () => setIsEditModalOpen(false),
  });

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const suspendedAccountsCount = useMemo(() => {
    return customers.filter((c) => c.status?.toLowerCase() === "suspendu")
      .length;
  }, [customers]);

  const selectedCustomerStats = useMemo(() => {
    if (!selectedCustomer)
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
    const customerApps = monthlyAppointments.filter(
      (app) => app.id_user_customer === selectedCustomer.id_user,
    );
    const customerAppIds = customerApps.map((app) => app.id_appointment);
    const customerReviews = reviews.filter((rev) =>
      customerAppIds.includes(rev.id_appointment),
    );
    const gridTitle1 = "Réservation";
    const gridValue1 = customerApps.length;
    const gridTitle2 = "Réservation annulé";
    const gridValue2 = customerApps.filter(
      (app) => app.status === "annulé",
    ).length;
    const gridTitle3 = "Avis laissés";
    const gridValue3 = customerReviews.length;
    const gridTitle4 = "Signalemments";
    const gridValue4 = customerReviews.filter(
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
  }, [selectedCustomer, monthlyAppointments, reviews]);

  const uniqueDepartments = useMemo(() => {
    const depts = customers
      .map((c) => (c.postal_code ? c.postal_code.substring(0, 2) : ""))
      .filter((dept) => dept.length === 2);
    return Array.from(new Set(depts)).sort();
  }, [customers]);

  const uniqueStatus = useMemo(() => {
    const statusList = customers
      .map((c) => c.status || "")
      .filter((s) => s.trim() !== "");
    return Array.from(new Set(statusList)).sort();
  }, [customers]);

  const columns: DataGridColumn<Customer & { id: number }>[] = [
    {
      key: "name",
      header: "Utilisateur",
      render: (customer) => (
        <div className="user-grid-client-cell">
          <img
            src={getImageUrl(customer.avatar_url)}
            alt={`${customer.firstname} ${customer.lastname}`}
            className="user-grid-avatar"
          />
          <div className="user-grid-info">
            <span className="user-grid-fullname">
              {customer.firstname} {customer.lastname}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (customer) => (
        <div className="user-grid-info">{customer.email}</div>
      ),
    },
    {
      key: "city",
      header: "Ville",
      render: (customer) => (
        <div className="user-grid-info">{customer.city}</div>
      ),
    },
    {
      key: "postal_code",
      header: "Code postal",
      render: (customer) => (
        <div className="user-grid-info">{customer.postal_code}</div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (customer) => (
        <div
          className={`user-grid-info status-${customer.status?.toLowerCase()}`}
        >
          {customer.status}
        </div>
      ),
    },
    {
      key: "create_time",
      header: "Date de création",
      render: (customer) => (
        <div className="user-grid-info">
          {format(new Date(customer.create_time), "dd MMM yyyy", {
            locale: fr,
          })}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (customer) => (
        <div className="user-grid-actions-cell">
          <button
            type="button"
            className="user-grid-icon-btn"
            onClick={() => {
              setSelectedCustomer(customer);
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
    <div className="admin-users-body">
      <header className="admin-users-header">
        <div className="admin-users-title">
          <FiUserPlus className="admin-users-title-icon" />
          <h1>Gestion des utilisateurs</h1>
        </div>
        <p>Gérez et suivez les utilisateurs de votre plateforme</p>
      </header>
      <main className="admin-users-main">
        <section className="admin-users-main-left">
          <div className="admin-users-body-stats">
            <StatsCard
              Icon={FiUserPlus}
              title="utilisateurs"
              value={customers.length}
              cycle="Total"
            />
            <StatsCard
              Icon={FiUserPlus}
              iconColor="icon-success"
              title="Nouveaux utilisateurs"
              value={monthlyNewUsers.length}
              cycle="Les 30 derniers jours"
            />
            <StatsCard
              Icon={FiPause}
              iconColor="icon-warning"
              title="Comptes suspendus"
              value={suspendedAccountsCount}
              cycle="Total"
            />
            <StatsCard
              Icon={FiCalendar}
              iconColor="icon-info"
              title="Réservations"
              value={monthlyAppointments.length}
              cycle="Les 30 derniers jours"
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
              onRowClick={(customer) => setSelectedCustomer(customer)}
              rowsPerPage={6}
              selectedId={selectedCustomer?.id}
            />
          </div>
        </section>
        <aside className="admin-users-main-aside">
          {selectedCustomer ? (
            <UserProfilCard
              selectedUser={selectedCustomer}
              selectedUserStats={selectedCustomerStats}
              onEditClick={() => setIsEditModalOpen(true)}
              onToggleSuspendClick={() => handleToggleSuspend(selectedCustomer)}
              deleteUser={() => deleteUser(selectedCustomer)}
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
        user={selectedCustomer}
        onSave={handleSave}
        onToggleSuspend={handleToggleSuspend}
        deleteUser={() => {
          if (selectedCustomer) {
            deleteUser(selectedCustomer);
          }
        }}
      />
    </div>
  );
}

export default Users;
