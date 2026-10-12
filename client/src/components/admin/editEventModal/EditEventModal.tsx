import { useEffect, useRef, useState } from "react";
import { FiCamera, FiMapPin, FiX } from "react-icons/fi";
import type { Event } from "../../../types/event";
import "./EditEventModal.css";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: (Event & { id: number }) | null;
  onSave: (formData: FormData) => void;
  onDelete: (event: Event & { id: number }) => Promise<void>;
}
const getImageUrl = (imageUrl: string | undefined) => {
  if (!imageUrl) return "/placeholder-image.png";

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${imageUrl}`;
};
function EditEventModal({
  isOpen,
  onClose,
  event,
  onSave,
  onDelete,
}: EditEventModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "brouillon",
    start_date: "",
    end_date: "",
    location: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        status: event.status || "brouillon",
        start_date: event.start_date ? event.start_date.substring(0, 16) : "",
        end_date: event.end_date ? event.end_date.substring(0, 16) : "",
        location: event.location || "",
      });
      setImagePreview(getImageUrl(event.image_url));
      setSelectedFile(null);
    } else {
      setFormData({
        title: "",
        description: "",
        status: "brouillon",
        start_date: "",
        end_date: "",
        location: "",
      });
      setImagePreview(getImageUrl(undefined));
      setSelectedFile(null);
    }
  }, [event]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = new FormData();

    if (event?.id_event) {
      dataToSend.append("id_event", String(event.id_event));
    }
    dataToSend.append("title", formData.title);
    dataToSend.append("description", formData.description);
    dataToSend.append("status", formData.status);
    dataToSend.append("start_date", formData.start_date);
    dataToSend.append("end_date", formData.end_date);
    dataToSend.append("location", formData.location);

    if (selectedFile) {
      dataToSend.append("image", selectedFile);
    }

    onSave(dataToSend);
  };

  return (
    <div className="editEventModal-modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div>
            <h2>{event ? "Modifier l'événement" : "Créer un événement"}</h2>
            <p>
              {event
                ? "Modifiez les détails de l'événement ci-dessous."
                : "Remplissez les informations pour ajouter un nouvel événement."}
            </p>
          </div>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-grid-top">
              <div className="avatar-section">
                <div className="avatar-wrapper event-cover-wrapper">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Aperçu de l'événement" />
                  ) : (
                    <div className="image-placeholder">
                      <FiCamera size={24} />
                      <span>Aucune image</span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  name="image"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />

                <button
                  type="button"
                  className="change-photo-btn"
                  onClick={handleTriggerFileInput}
                >
                  {imagePreview ? "Changer l'image" : "Ajouter une image"}
                </button>
              </div>

              <div className="form-fields-top">
                <div className="form-group full-width">
                  <label htmlFor="title">Titre de l'événement *</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Nom de l'événement"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="location">Lieu / Adresse *</label>
                  <div className="input-icon-container">
                    <FiMapPin className="field-icon" />
                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex: Lieu de l'événement"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="status">Statut *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="brouillon">🟡 Brouillon</option>
                    <option value="publié">🟢 Publié</option>
                    <option value="annulé">🔴 Annulé</option>
                    <option value="terminé">🔵 Terminé</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="modal-divider" />

            <h3 className="section-title">Planification & Dates</h3>
            <div className="modal-grid-middle">
              <div className="form-group">
                <label htmlFor="start_date">Date et heure de début *</label>
                <div className="input-icon-container">
                  <input
                    id="start_date"
                    type="datetime-local"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="end_date">Date et heure de fin *</label>
                <div className="input-icon-container">
                  <input
                    id="end_date"
                    type="datetime-local"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="modal-divider" />

            <h3 className="section-title">Description de l'événement</h3>
            <div className="form-group full-width">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le déroulement, les spécificités de l'événement..."
                rows={4}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="action-bouton cancel-btn"
              onClick={onClose}
            >
              Annuler
            </button>
            <button type="submit" className="action-bouton save-btn">
              {event ? "Enregistrer les modifications" : "Créer l'événement"}
            </button>
            {event && (
              <button
                type="button"
                className="action-bouton delete-btn"
                onClick={async () => {
                  await onDelete(event);
                  onClose();
                }}
              >
                Supprimer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEventModal;
