import "../../../components/customer/Profile/EditProfileModal.css";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import type { Barber } from "../../../types/barber";

type Props = {
  barber: Barber;
  onClose: () => void;
  onSave: () => void;
};

function EditBarberModal({ barber, onClose, onSave }: Props) {
  const [name, setName] = useState(barber.name);
  const [email, setEmail] = useState(barber.email);
  const [phone, setPhone] = useState(barber.phone ?? "");
  const [city, setCity] = useState(barber.city);
  const [postalCode, setPostalCode] = useState(barber.postal_code);
  const [adress, setAdress] = useState(barber.adress);
  const [description, setDescription] = useState(barber.description ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updated = {
      ...barber,
      name,
      email,
      phone,
      city,
      postal_code: postalCode,
      adress,
      description,
    };

    try {
      const res = await fetch(`${API_URL}/api/barber/${barber.id_user}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    name !== barber.name ||
    email !== barber.email ||
    phone !== (barber.phone ?? "") ||
    city !== barber.city ||
    postalCode !== barber.postal_code ||
    adress !== barber.adress ||
    description !== (barber.description ?? "");

  return (
    <div className="modal">
      <button
        type="button"
        className="modal__overlay"
        onClick={onClose}
        aria-label="Fermer la modale"
      />
      <div className="modal__content">
        <button type="button" className="modal__close-button" onClick={onClose}>
          <FiX />
        </button>

        <h2 className="modal-content__header">Modifier mon profil</h2>

        <label className="modal-content__label">
          Nom / Salon
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="modal-content__item"
          />
        </label>

        <label className="modal-content__label">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="modal-content__item"
          />
        </label>

        <label className="modal-content__label">
          Téléphone
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="modal-content__item"
          />
        </label>

        <label className="modal-content__label">
          Ville
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="modal-content__item"
          />
        </label>

        <label className="modal-content__label">
          Code postal
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="modal-content__item"
          />
        </label>

        <label className="modal-content__label">
          Adresse
          <input
            type="text"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
            className="modal-content__item"
          />
        </label>

        <label className="modal-content__label">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="modal-content__item"
            rows={3}
          />
        </label>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-actions__button"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={!hasChanges || isLoading}
            onClick={handleSave}
            className="modal-actions__button"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditBarberModal;
