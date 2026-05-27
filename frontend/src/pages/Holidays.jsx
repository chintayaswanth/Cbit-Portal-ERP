import { useState, useEffect } from "react";
import Papa from "papaparse";
import "../css/holidays.css";

function SkeletonRow({ index }) {
  return (
    <tr className="skeleton-row">
      <td><div className="skeleton skeleton-num" /></td>
      <td><div className="skeleton skeleton-title" style={{ width: `${50 + (index % 5) * 10}%` }} /></td>
      <td><div className="skeleton skeleton-date" /></td>
      <td><div className="skeleton skeleton-day" /></td>
    </tr>
  );
}

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [filter, setFilter] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  const today = new Date();

  useEffect(() => {
    fetch("/data/holiday.csv")
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse(text, { header: true, skipEmptyLines: true });
        setHolidays(result.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading holidays:", err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const upcoming = holidays.filter((h) => new Date(h.date) >= today).sort((a, b) => new Date(a.date) - new Date(b.date));
  const completed = holidays.filter((h) => new Date(h.date) < today).sort((a, b) => new Date(b.date) - new Date(a.date));
  const weekend = holidays.filter((h) => h.type === "weekend").sort((a, b) => new Date(a.date) - new Date(b.date));

  const displayData =
    filter === "upcoming" ? upcoming :
      filter === "completed" ? completed : weekend;

  return (
    <div className="holiday-page">
      <h2 className="holiday-heading">CBIT Holidays 2026</h2>

      <div className="holiday-buttons">
        {["upcoming", "completed", "weekend"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
            disabled={loading}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <table className="holiday-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Occasion / Festival</th>
            <th>Date</th>
            <th>Day</th>
          </tr>
        </thead>

        <tbody key={filter}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} index={i} />)
            : displayData.map((h, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{h.name}</td>
                <td>{formatDate(h.date)}</td>
                <td>{h.day}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default Holidays;