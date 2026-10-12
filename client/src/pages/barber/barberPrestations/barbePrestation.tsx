import { useEffect, useState } from "react";
import usePrestations from "../../../hooks/usePrestations";
import type { Prestation } from "../../../types/prestation";
import "./barberPrestation.css";

const API_URL = import.meta.env.VITE_API_URL;
const emptyForm = { name: "", duration: "", price: "" };

function BarberPrestation() {
  const userString = localStorage.getItem("user");
  const loggedUser = userString ? JSON.parse(userString) : null;
  const barberId = loggedUser?.id ? Number(loggedUser.id) : undefined;

  const initialPrestations = usePrestations(barberId);
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    setPrestations(initialPrestations);
  }, [initialPrestations]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  function handleEdit(p: Prestation) {
    setEditingId(p.id_prestation);
    setForm({
      name: p.name,
      duration: String(p.duration_minutes),
      price: String(p.price),
    });
  }

  function handleCancel() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleDelete(id: number) {
    const res = await fetch(`${API_URL}/api/barber/prestations/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) return;

    setPrestations((prev) => prev.filter((p) => p.id_prestation !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!barberId) return;

    const body = {
      name: form.name,
      price: Number(form.price),
      duration_minutes: Number(form.duration),
    };

    if (editingId !== null) {
      await fetch(`${API_URL}/api/barber/prestations/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });
      setPrestations((prev) =>
        prev.map((p) =>
          p.id_prestation === editingId ? { ...p, ...body } : p,
        ),
      );
    } else {
      const res = await fetch(`${API_URL}/api/barber/prestations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });
      const newPrestation = await res.json();
      setPrestations((prev) => [...prev, newPrestation]);
    }

    handleCancel();
  }

  return (
    <div className="barber-prestation">
      <h2 className="barber-prestation__title">Mes prestations</h2>
      <ul className="barber-prestation__list">
        {prestations.map((p) => (
          <li className="barber-prestation__item" key={p.id_prestation}>
            <span className="barber-prestation__name">{p.name}</span>
            <span className="barber-prestation__duration">
              {p.duration_minutes} min
            </span>
            <span className="barber-prestation__price">{p.price} €</span>
            <button
              type="button"
              className="barber-prestation__edit-btn"
              onClick={() => handleEdit(p)}
            >
              ✏️
            </button>
            <button
              type="button"
              className="barber-prestation__delete-btn"
              onClick={() => handleDelete(p.id_prestation)}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      <h2 className="barber-prestation__form-title">
        {editingId !== null
          ? "Modifier la prestation"
          : "Ajouter une prestation"}
      </h2>
      <form className="barber-prestation__form" onSubmit={handleSubmit}>
        <label className="barber-prestation__label" htmlFor="name">
          Nom de la prestation
        </label>
        <input
          id="name"
          className="barber-prestation__input"
          type="text"
          placeholder="Ex : Coupe + Soin"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label className="barber-prestation__label" htmlFor="duration">
          Durée (minutes)
        </label>
        <input
          id="duration"
          className="barber-prestation__input"
          type="number"
          placeholder="Ex : 30"
          value={form.duration}
          onChange={handleChange}
          required
        />

        <label className="barber-prestation__label" htmlFor="price">
          Prix (€)
        </label>
        <input
          id="price"
          className="barber-prestation__input"
          type="number"
          placeholder="Ex : 25"
          value={form.price}
          onChange={handleChange}
          required
        />

        <div className="barber-prestation__actions">
          <button
            type="button"
            className="barber-prestation__cancel-btn"
            onClick={handleCancel}
          >
            Annuler
          </button>
          <button type="submit" className="barber-prestation__submit-btn">
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}

export default BarberPrestation;
