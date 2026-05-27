import { useEffect, useState } from "react";
import "../css/placements.css";

// Skeleton row component
function SkeletonRow({ index }) {
  return (
    <tr className="skeleton-row">
      <td>
        <div className="skeleton skeleton-num" />
      </td>
      <td>
        <div
          className="skeleton skeleton-title"
          style={{ width: `${60 + (index % 4) * 10}%` }}
        />
      </td>
      <td>
        <div className="skeleton skeleton-link" />
      </td>
    </tr>
  );
}

function Placements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const rowsPerPage = 10;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await fetch(
          `${API_URL}/placements?page=${currentPage}&limit=${rowsPerPage}`
        );

        const json = await res.json();

        setPlacements(json.data);
        setTotalPages(json.pagination.totalPages);
        setTotalItems(json.pagination.totalItems);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlacements();
  }, [currentPage, API_URL]);
  const indexOfFirst = (currentPage - 1) * rowsPerPage;

  return (
    <div className="placements-container">
      <h2 className="placements-heading">CBIT Placement Circulars</h2>

      <table className="placements-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Circular</th>
            <th>PDF</th>
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({ length: rowsPerPage }).map((_, i) => (
              <SkeletonRow key={i} index={i} />
            ))
            : placements.map((item, index) => (
              <tr key={index}>
                <td>{indexOfFirst + index + 1}</td>

                <td>{item.title}</td>

                <td>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="placements-link"
                  >
                    Open
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1 || loading}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages || loading}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {!loading && (
        <p className="total-items">
          Total Circulars: {totalItems}
        </p>
      )}
    </div>
  );
}

export default Placements;