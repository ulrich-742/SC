// import { useEntityActions } from "../../../hooks/useEntityActions";
// import type { Barber } from "../../../types/barber";
import "./MondalParametres.css";

type ModalParametreProps = {
  onClose: () => void;
};
const userId = 17;

const API_URL = import.meta.env.VITE_API_URL;
// const { deleteUser } = useEntityActions<Barber & { id: number }>({ apiBase: API_URL, idField: "api/users" })
const deleteUser = async () => {
  try {
    const res = await fetch(`${API_URL}/api/users/${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) return;
  } catch (err) {
    console.error(err);
  }
};
function ModalParametres({ onClose }: ModalParametreProps) {
  return (
    <div className="modalParametre">
      <div className="modalParametre__content">
        <button
          type="button"
          className="modalParametre__close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="modalParametre__icon">⚠️</div>

        <h2>Supprimer mon compte</h2>

        <p className="modalParametre__description">
          Cette action est définitive. Toutes vos données seront supprimées.
        </p>

        <div className="modalParametre__warning">
          <h3>Vous allez perdre :</h3>

          <ul>
            <li>Vos informations personnelles</li>
            <li>Vos services</li>
            <li>Vos disponibilités</li>
            <li>Vos réservations</li>
            <li>Vos avis et commentaires</li>
          </ul>
        </div>

        <div className="modalParametre__actions">
          <button
            type="button"
            className="modalParametre__cancel"
            onClick={onClose}
          >
            Annuler
          </button>

          <button
            type="button"
            className="modalParametre__delete"
            onClick={deleteUser}
          >
            Je comprends, supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalParametres;
