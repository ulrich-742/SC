import { useCallback, useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { useEntityActions } from "../../../hooks/useEntityActions";
import type { Barber } from "../../../types/barber";
import EditUserModal from "../editUserModal/EditUserModal";
import "./ApprovalCard.css";

function ApprovalCard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { fetchWithAuth } = useAuth();
  const [barbers, setBarbers] = useState<Barber[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  const loadbarbersData = useCallback(() => {
    fetchWithAuth(`${apiUrl}/api/admin/barbers`)
      .then((res) => res.json())
      .then((data) => setBarbers(data));
  }, [fetchWithAuth]);

  useEffect(() => {
    loadbarbersData();
  }, [loadbarbersData]);

  const { handleSave, handleToggleSuspend, deleteUser } = useEntityActions<
    Barber & { id: number }
  >({
    apiBase: apiUrl,
    idField: "api/admin/barbers",
    onActionComplete: loadbarbersData,
    onClose: () => setIsModalOpen(false),
  });

  const handleValidate = async (barber: Barber) => {
    const entityFormat = {
      ...barber,
      id: barber.id_user,
      status: "En attente",
    };
    await handleToggleSuspend(entityFormat);
  };

  const handleMoreOptions = (barber: Barber) => {
    setSelectedBarber(barber);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date inconnue";
    const dateObj = new Date(dateStr);
    return `Inscrit le ${dateObj.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  const pendingBarbers = barbers
    .filter((barber) => barber.status === "En attente")
    .slice(0, 3);

  const modalUserData = selectedBarber
    ? { ...selectedBarber, id: selectedBarber.id_user }
    : null;

  return (
    <div className="approval-card-main">
      <div className="approval-card-header">
        <h3>Coiffeurs en attente de validation</h3>
        <a href="/admin/barbers" className="see-all-link">
          Voir tout
        </a>
      </div>

      <div className="approval-card-list">
        {pendingBarbers.map((barber) => (
          <div key={barber.id_user} className="hairdresser-item">
            <div className="hairdresser-info">
              <img
                src={barber.avatar_url || "/default-avatar.png"}
                alt={barber.name}
                className="hairdresser-avatar"
              />
              <div className="hairdresser-text">
                <span className="hairdresser-name">{barber.name}</span>
                <span className="hairdresser-date">
                  {formatDate(barber.create_time)}
                </span>
              </div>
            </div>

            <div className="hairdresser-actions">
              <button
                type="button"
                className="validate-btn"
                onClick={() => handleValidate(barber)}
              >
                Valider
              </button>
              <button
                type="button"
                className="options-btn"
                onClick={() => handleMoreOptions(barber)}
                aria-label="Plus d'options"
              >
                <FiEye />
              </button>
            </div>
          </div>
        ))}
      </div>

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={modalUserData}
        onSave={handleSave}
        onToggleSuspend={handleToggleSuspend}
        deleteUser={() => {
          if (modalUserData) deleteUser(modalUserData);
        }}
      />
    </div>
  );
}

export default ApprovalCard;
