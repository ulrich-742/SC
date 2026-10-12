import { useEffect, useState } from "react";
import type { Review } from "../types/review";

const API_URL = import.meta.env.VITE_API_URL;

function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  return reviews;
}

export default useReviews;
