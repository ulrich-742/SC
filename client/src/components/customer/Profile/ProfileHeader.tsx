import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FiCalendar, FiChevronLeft, FiEdit2 } from "react-icons/fi";
import type { Customer } from "./../../../types/Customer";
import "./ProfileHeader.css";
import { useRef } from "react";
import { LuUpload } from "react-icons/lu";

type Props = {
  customer: Customer;
  onEdit: () => void;
  onAvatarUpdated: () => void;
};

const API_URL = import.meta.env.VITE_API_URL;

function ProfileHeader({ customer, onEdit, onAvatarUpdated }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChoosePhoto = () => {
    inputRef.current?.click();
  };
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch(`${API_URL}/api/users/${customer.id_user}/avatar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    console.log("STATUS", res.status);

    const data = await res.json();
    console.log("DATA", data);

    if (res.ok) {
      onAvatarUpdated();
    }
  };

  return (
    <section className="profile-header">
      <button
        type="button"
        className="profile-header__back-button"
        onClick={() => window.history.back()}
      >
        <FiChevronLeft />
      </button>
      <button
        type="button"
        className="profile-page__edit-button"
        onClick={onEdit}
      >
        <FiEdit2 />
      </button>
      <div className="profile-header__content">
        <div className="profile-page__avatar-wrapper">
          <img
            src={`${API_URL}${customer.avatar_url}`}
            alt={`Avatar de ${customer.email}`}
            className="profile-header__avatar"
          />
          <button
            type="button"
            className="profile-page__photo"
            onClick={handleChoosePhoto}
            aria-label="Changer la photo de profil"
          >
            <LuUpload className="profile-page__icon" />
            Modifier la photo
          </button>
        </div>

        <div className="profile-header__identity">
          <p className="profile-header__eyebrow">Profil utilisateur</p>
          <h1 className="profile-header__name">
            {customer.firstname} {customer.lastname}
          </h1>
          <p className="profile-header__email">{customer.email}</p>
          <p className="profile-header__member-since">
            <FiCalendar className="profile-header__member-icon" />
            <span>
              Membre depuis{" "}
              {format(new Date(customer.create_time), "dd MMMM yyyy", {
                locale: fr,
              })}
            </span>
          </p>
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        hidden
        ref={inputRef}
      />
    </section>
  );
}
export default ProfileHeader;
