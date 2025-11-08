import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../UserContext/usercontext";
import Header from "../../Navbar/header";

const backendURL = "http://localhost:5000";

const History = () => {
  const { currentUser } = useContext(UserContext);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (currentUser?._id) fetchHistory();
  }, [currentUser]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${backendURL}/api/history/${currentUser._id}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB");
  };

  const completedGoals = records.filter((r) => r.status === "completed");
  const deletedGoals = records.filter((r) => r.status === "deleted");

  const renderCards = (items, type) =>
    items.length === 0 ? (
      <p className="text-center text-muted">No records found</p>
    ) : (
      <div className="row g-4">
        {items.map((rec, i) => (
          <div className="col-md-6" key={rec._id}>
            <div
              className={`card shadow-sm rounded-4 border-0 p-4 ${
                type === "completed" ? "bg-completed" : "bg-deleted"
              }`}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="fw-semibold text-dark mb-0">
                  {i + 1}. {rec.goalTitle}
                </h5>
                <span
                  className={`badge ${
                    type === "completed" ? "badge-completed" : "badge-deleted"
                  }`}
                >
                  {type.toUpperCase()}
                </span>
              </div>
              <small className="text-muted d-block mb-2">
                {formatDate(rec.startDate)} — {formatDate(rec.endDate)}
              </small>
              <p className="text-secondary mb-3">{rec.goalDescription}</p>
              {rec.completedOn && (
                <p className="small mb-0 text-end text-muted">
                  Completed On: <strong>{formatDate(rec.completedOn)}</strong>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <>
      <Header />
      <div className="container py-5" style={{ maxWidth: "1000px", marginTop: "6rem" }}>
        <h3 className="fw-bold mb-5 text-center text-dark">📜 Goal History</h3>

        {/* Completed Goals Section */}
        <div className="mb-5">
          <h4 className="fw-semibold mb-3 text-dark">✅ Completed Goals</h4>
          {renderCards(completedGoals, "completed")}
        </div>

        {/* Deleted Goals Section */}
        <div className="mb-5">
          <h4 className="fw-semibold mb-3 text-dark">🗑 Deleted Goals</h4>
          {renderCards(deletedGoals, "deleted")}
        </div>
      </div>

      <style>{`
        .card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
        }
        .bg-completed {
          background-color: #eaf4ea !important; /* subtle green */
        }
        .bg-deleted {
          background-color: #f9ecec !important; /* subtle red */
        }
        .badge-completed {
          background-color: #4caf50;
          color: white;
          font-size: 0.75rem;
          padding: 0.35em 0.6em;
          border-radius: 0.5rem;
        }
        .badge-deleted {
          background-color: #f44336;
          color: white;
          font-size: 0.75rem;
          padding: 0.35em 0.6em;
          border-radius: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default History;
