import { useEffect, useState } from "react";
import type { Barber } from "../types/barber";

const API_URL = import.meta.env.VITE_API_URL;

function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/barbers`)
      .then((res) => res.json())
      .then((data) => setBarbers(data));
  }, []);

  return barbers;
}

export default useBarbers;
