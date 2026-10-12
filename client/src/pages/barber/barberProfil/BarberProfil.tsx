import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useCallback, useEffect, useRef, useState } from "react";
import { CiLogout } from "react-icons/ci";
import { FaBirthdayCake, FaHouseUser } from "react-icons/fa";
import {
  FiCalendar,
  FiEdit,
  FiEdit2,
  FiImage,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { LuUpload } from "react-icons/lu";
import { MdOutlineLocalPostOffice } from "react-icons/md";
import { useNavigate } from "react-router";
import EditBarberModal from "../../../components/barber/EditBarberModal/EditBarberModal";
import { useAuth } from "../../../context/AuthContext";
import type { Barber } from "../../../types/barber";
import "../../../components/customer/Profile/ProfileHeader.css";
import "../../../components/customer/Profile/ProfileInfo.css";
import "../../../components/customer/Profile/ProfileActions.css";
import "./BarberProfil.css";

type Photo = { id: number; src: string; title: string };

const API_URL = import.meta.env.VITE_API_URL;

function BarberProfil() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const barberId = user?.id ?? null;
  const [activeTab, setActiveTab] = useState("informations");
  const [barberData, setBarberData] = useState<Barber | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(async () => {
    if (!barberId) return;
    try {
      const [barberRes, portfolioRes] = await Promise.all([
        fetch(`${API_URL}/api/barbers/${barberId}`),
        fetch(`${API_URL}/api/barbers/${barberId}/portfolio`),
      ]);
      if (!barberRes.ok) throw new Error("Impossible de charger le profil");
      const barber = await barberRes.json();
      setBarberData(barber);
      if (portfolioRes.ok) {
        const portfolio = await portfolioRes.json();
        setPhotos(
          portfolio.map(
            (p: {
              id_portfolio: number;
              image_url: string;
              title: string;
            }) => ({
              id: p.id_portfolio,
              src: `${API_URL}${p.image_url}`,
              title: p.title,
            }),
          ),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [barberId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/api/barber/${barberId}/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Échec de l'upload");
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: Photo[] = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      src: URL.createObjectURL(file),
      title: file.name,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleDeleteConfirm = () => {
    setPhotos((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setDeleteMode(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading)
    return <div className="barber-profil__loading">Chargement du profil…</div>;
  if (!barberData) return null;

  return (
    <div className="barber-profil-page">
      {/* ── Tabs ── */}
      <div className="barber-profil__tabs">
        <button
          type="button"
          className={`barber-profil__tab ${activeTab === "informations" ? "barber-profil__tab--active" : ""}`}
          onClick={() => setActiveTab("informations")}
        >
          Informations
        </button>
        <button
          type="button"
          className={`barber-profil__tab ${activeTab === "galerie" ? "barber-profil__tab--active" : ""}`}
          onClick={() => setActiveTab("galerie")}
        >
          <FiImage className="barber-profil__tab-icon" />
          Galerie
        </button>
      </div>

      {activeTab === "informations" && (
        <main className="profile-page">
          {/* ── Header ── */}
          <section className="profile-header">
            <button
              type="button"
              className="profile-header__back-button"
              onClick={() => window.history.back()}
            >
              ‹
            </button>
            <button
              type="button"
              className="profile-page__edit-button"
              onClick={() => setShowEditModal(true)}
            >
              <FiEdit2 />
            </button>

            <div className="profile-header__content">
              <div className="profile-page__avatar-wrapper">
                {barberData.avatar_url ? (
                  <img
                    src={`${API_URL}${barberData.avatar_url}`}
                    alt={`Avatar de ${barberData.name}`}
                    className="profile-header__avatar"
                  />
                ) : (
                  <div className="barber-profil__avatar-placeholder">
                    {barberData.name?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <button
                  type="button"
                  className="profile-page__photo"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploading}
                >
                  <LuUpload className="profile-page__icon" />
                  {uploading ? "Envoi…" : "Modifier la photo"}
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={handleAvatarUpload}
                />
              </div>

              <div className="profile-header__identity">
                <p className="profile-header__eyebrow">Profil coiffeur</p>
                <h1 className="profile-header__name">{barberData.name}</h1>
                <p className="profile-header__email">{barberData.email}</p>
                {barberData.create_time && (
                  <p className="profile-header__member-since">
                    <FiCalendar className="profile-header__member-icon" />
                    <span>
                      Membre depuis{" "}
                      {format(
                        new Date(barberData.create_time),
                        "dd MMMM yyyy",
                        {
                          locale: fr,
                        },
                      )}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ── Infos ── */}
          <section className="profile-info">
            <div className="profile-info__card">
              <div className="profile-info__item">
                <FiMail className="profile-info__icon" />
                <span className="profile-info__label">
                  {barberData.email || "Non renseigné"}
                </span>
              </div>
              <div className="profile-info__item">
                <FiPhone className="profile-info__icon" />
                <span className="profile-info__label">
                  {barberData.phone || "Non renseigné"}
                </span>
              </div>
              <div className="profile-info__item">
                <FiMapPin className="profile-info__icon" />
                <span className="profile-info__label">
                  {barberData.city || "Non renseigné"}
                </span>
              </div>
              <div className="profile-info__item">
                <MdOutlineLocalPostOffice className="profile-info__icon" />
                <span className="profile-info__label">
                  {barberData.postal_code || "Non renseigné"}
                </span>
              </div>
              <div className="profile-info__item">
                <FaHouseUser className="profile-info__icon" />
                <span className="profile-info__label">
                  {barberData.adress || "Non renseigné"}
                </span>
              </div>
              <div className="profile-info__item">
                <FaBirthdayCake className="profile-info__icon" />
                <span className="profile-info__label">
                  {barberData.birthday
                    ? format(new Date(barberData.birthday), "dd MMMM yyyy", {
                        locale: fr,
                      })
                    : "Non renseigné"}
                </span>
              </div>
            </div>
          </section>

          {/* ── Actions ── */}
          <section className="profile-actions">
            <button
              type="button"
              className="profile-actions__button"
              onClick={() => navigate("/barber/planning")}
            >
              <FiCalendar className="profile-actions__icon" />
              <span>Voir mon planning</span>
            </button>
            <button
              type="button"
              className="profile-actions__button"
              onClick={() => setShowEditModal(true)}
            >
              <FiEdit className="profile-actions__icon" />
              <span>Modifier mon profil</span>
            </button>
            <button
              type="button"
              className="profile-actions__button"
              onClick={handleLogout}
            >
              <CiLogout className="profile-actions__icon" />
              <span>Déconnexion</span>
            </button>
          </section>
        </main>
      )}

      {activeTab === "galerie" && (
        <div className="barber-profil__galerie">
          <div className="barber-profil__grid">
            {photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                className={`barber-profil__grid-item-wrapper ${selectedIds.includes(photo.id) ? "barber-profil__grid-item-wrapper--selected" : ""}`}
                onClick={() => deleteMode && toggleSelect(photo.id)}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="barber-profil__grid-item"
                />
              </button>
            ))}
          </div>

          <div className="barber-profil__galerie-actions">
            <button
              type="button"
              className="barber-profil__add-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <FiPlus /> Ajouter une photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={handleAddPhoto}
            />
            {deleteMode ? (
              <button
                type="button"
                className="barber-profil__delete-btn barber-profil__delete-btn--confirm"
                onClick={handleDeleteConfirm}
              >
                <FiTrash2 /> Confirmer ({selectedIds.length})
              </button>
            ) : (
              <button
                type="button"
                className="barber-profil__delete-btn"
                onClick={() => setDeleteMode(true)}
              >
                <FiTrash2 /> Supprimer des photos
              </button>
            )}
          </div>
        </div>
      )}

      {showEditModal && (
        <EditBarberModal
          barber={barberData}
          onClose={() => setShowEditModal(false)}
          onSave={() => {
            loadData();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }}
        />
      )}

      {saved && <div className="barber-profil__toast">Profil enregistré ✓</div>}
    </div>
  );
}

export default BarberProfil;
