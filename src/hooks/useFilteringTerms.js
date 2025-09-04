import { useEffect, useState } from "react";

export default function useFilteringTerms() {
  const [filteringTerms, setFilteringTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${CONFIG.apiUrlNetwork}/filtering_terms`);
        const data = await response.json();
        setFilteringTerms(data.response?.filteringTerms || []);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching filtering terms:", err);
        setError("Failed to fetch filtering terms.");
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return { filteringTerms, loading, error };
}
