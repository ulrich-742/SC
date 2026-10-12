import { useEffect, useState } from "react";
import type { Prestation } from "../types/prestation";

const API_URL = import.meta.env.VITE_API_URL;

function usePrestations(barberId?: number) {
  const [prestations, setPrestations] = useState<Prestation[]>([]);

  useEffect(() => {
    if (!barberId) return;
    fetch(`${API_URL}/api/barbers/${barberId}/prestations`)
      .then((res) => res.json())
      .then((data) => setPrestations(data));
  }, [barberId]);

  return prestations;
}

export default usePrestations;
