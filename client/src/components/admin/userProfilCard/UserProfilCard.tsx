import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  FiAtSign,
  FiMapPin,
  FiPause,
  FiPhone,
  FiPlay,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import type { Barber } from "../../../types/barber";
import type { Customer } from "../../../types/Customer";

import "./UserProfilCard.css";

interface UserStats {
  gridValue1: number;
  gridValue2: number;
  gridValue3: number;
  gridValue4: number;
  gridTitle1: string;
  gridTitle2: string;
  gridTitle3: string;
  gridTitle4: string;
}

interface UserProfilCardProps {
  selectedUser: (Customer | Barber) & { id: number };
  selectedUserStats: UserStats;
  onEditClick: () => void;
  onToggleSuspendClick: () => void;
  deleteUser: () => void;
}
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder-image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
};
function UserProfilCard({
  selectedUser,
  selectedUserStats,
  onEditClick,
  onToggleSuspendClick,
  deleteUser,
}: UserProfilCardProps) {
  const isSuspended = selectedUser.status?.toLowerCase() === "suspendu";
  const isPending = selectedUser.status?.toLowerCase() === "en attente";
  const displayName =
    "name" in selectedUser
      ? selectedUser.name
      : `${selectedUser.firstname} ${selectedUser.lastname}`;

  return (
    <div className="userProfilCard-main">
      <h2>Détail utilisateur</h2>
      <div className="userProfilCard-header">
        <img
          className="userProfilCard-avatar"
          src={getImageUrl(selectedUser.avatar_url)}
          alt={displayName}
        />
        <h3>{displayName}</h3>
        <p>
          Utilisateur depuis{" "}
          {selectedUser.create_time
            ? format(new Date(selectedUser.create_time), "dd MMM yyyy", {
                locale: fr,
              })
            : "Date inconnue"}
        </p>
      </div>
      <div className="userProfilCard-info">
        <span>
          <FiAtSign className="userProfilCard-info-icon" />
          {selectedUser.email}
        </span>
        <span>
          <FiPhone className="userProfilCard-info-icon" />
          {selectedUser.phone}
        </span>
        <span>
          <FiMapPin className="userProfilCard-info-icon" />
          {selectedUser.city} {selectedUser.postal_code}
        </span>
      </div>
      <div className="userProfilCard-grid">
        <div className="userProfilCard-grid-case">
          <span>{selectedUserStats.gridValue1}</span>
          <p>{selectedUserStats.gridTitle1}</p>
        </div>
        <div className="userProfilCard-grid-case">
          <span>{selectedUserStats.gridValue2}</span>
          <p>{selectedUserStats.gridTitle2}</p>
        </div>
        <div className="userProfilCard-grid-case">
          <span>{selectedUserStats.gridValue3}</span>
          <p>{selectedUserStats.gridTitle3}</p>
        </div>
        <div className="userProfilCard-grid-case">
          <span>{selectedUserStats.gridValue4}</span>
          <p>{selectedUserStats.gridTitle4}</p>
        </div>
      </div>
      <div className="userProfilCard-action">
        <h2>Actions rapides</h2>
        <button
          className="userProfilCard-action-button"
          type="button"
          onClick={onEditClick}
        >
          <FiUser /> Voir le profil
        </button>

        <button
          className={`userProfilCard-action-button ${
            isSuspended
              ? "active-btn"
              : isPending
                ? "active-btn"
                : "suspend-btn"
          }`}
          type="button"
          onClick={onToggleSuspendClick}
        >
          {isSuspended ? (
            <>
              <FiPlay /> Réactiver le compte
            </>
          ) : isPending ? (
            <>
              <FiPlay /> Approuver le profil
            </>
          ) : (
            <>
              <FiPause /> Suspendre le compte
            </>
          )}
        </button>

        <button
          className="userProfilCard-action-button delete-btn"
          type="button"
          onClick={deleteUser}
        >
          <FiTrash2 /> Supprimer le compte
        </button>
      </div>
    </div>
  );
}

export default UserProfilCard;
