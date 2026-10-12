import { useEffect, useState } from "react";
import type { Event } from "../types/event";

const API_URL = import.meta.env.VITE_API_URL;

function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return events;
}

export default useEvents;
