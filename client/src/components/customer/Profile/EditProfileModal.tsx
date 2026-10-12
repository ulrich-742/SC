import "./EditProfileModal.css";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import type { Customer } from "./../../../types/Customer";

type Props = {
  customer: Customer;
  onClose: () => void;
  onSave: (updatedCustomer: {
    firstname: string;
    lastname: string;
    email: string;
    city: string;
    postal_code: string;
    birthday?: string | null;
    adress: string;
    phone?: string;
  }) => void;
  loadData: () => void;
};
const formatBirthday = (val: string | null | undefined): string | null => {
  if (!val) return null;
  return String(val).substring(0, 10);
};

function EditProfileModal({ customer, onClose, onSave, loadData }: Props) {
  const [firstname, setFirstname] = useState(customer.firstname);
  const [lastname, setLastname] = useState(customer.lastname);
  const [email, setEmail] = useState(customer.email);
  const [city, setCity] = useState(customer.city);
  const [postalCode, setPostalCode] = useState(customer.postal_code);
  const [adress, setAdress] = useState(customer.adress);
  const [phone, setPhone] = useState(customer.phone);
  const [birthday, setBirthday] = useState(
    formatBirthday(customer.birthday) || "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSave = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    const updatedCustomer = {
      ...customer,
      firstname: firstname,
      lastname: lastname,
      email: email,
      city: city,
      postal_code: postalCode,
      adress: adress,
      phone: phone,
      birthday: formatBirthday(birthday),
    };

    try {
      console.log(updatedCustomer);
      const res = await fetch(`${API_URL}/api/customers/${customer.id_user}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedCustomer),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error("Status:", res.status);
        console.error("Body:", errorBody);
        throw new Error("Erreur lors de la mise à jour");
      }

      onSave(updatedCustomer);
      onClose();
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges =
    firstname !== customer.firstname ||
    lastname !== customer.lastname ||
    email !== customer.email ||
    city !== customer.city ||
    postalCode !== customer.postal_code ||
    adress !== customer.adress ||
    phone !== customer.phone ||
    birthday !== formatBirthday(customer.birthday);

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
          Prénom
          <input
            type="text"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="modal-content__item"
          />
        </label>
        <label className="modal-content__label">
          Nom
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
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
          Ville
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="modal-content__item"
          />
        </label>

        <label className="modal-content__label">
          Code postale
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
          Numero
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="modal-content__item"
          />
        </label>

        <label className="modal-content__label">
          Date de naissance
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="modal-content__item"
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
export default EditProfileModal;
