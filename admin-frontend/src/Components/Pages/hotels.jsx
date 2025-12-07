import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels, updateHotel, deleteHotel } from "../Slices/slice/hotelSlice";

export default function Hotels() {
  const dispatch = useDispatch();
  const { hotels, status, error } = useSelector((state) => state.hotels || {});

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  const handleToggleStatus = (hotel) => {
    const newStatus = hotel.status === "open" ? "closed" : "open";
    dispatch(updateHotel({ hotelId: hotel._id, updatedData: { status: newStatus } }));
  };

  const handleDelete = (hotel) => {
    if (!window.confirm(`Delete hotel ${hotel.name}? This action cannot be undone.`)) return;
    dispatch(deleteHotel(hotel._id));
  };

  return (
    <section className="admin-section">
      <div className="container">
        <h1 className="page-title">Hotels</h1>
        <p className="muted">List and manage hotel records.</p>

        <div className="card clients-card">
          {status === "loading" && <div className="clients-loading">Loading hotels...</div>}
          {status === "failed" && <div className="alert alert--error">{error || 'Failed to load hotels'}</div>}

          {status === "succeeded" && (!hotels || hotels.length === 0) && <div className="clients-empty">No hotels found.</div>}

          {hotels && hotels.length > 0 && (
            <div className="clients-table-wrap">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Owner ID</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hotels.map((h) => (
                    <tr key={h._id}>
                      <td>{h.name}</td>
                      <td>{h.userId}</td>
                      <td>{h.address}</td>
                      <td>{h.phone}</td>
                      <td>
                        <span className={`status-badge ${h.status === 'open' ? 'status-open' : 'status-closed'}`}>{h.status}</span>
                      </td>
                      <td>
                        {h.image ? <img src={h.image} alt={h.name} className="img-thumb" /> : <span className="muted">No image</span>}
                      </td>
                      <td className="actions-cell">
                        <button className="btn btn--ghost" onClick={() => handleToggleStatus(h)}>
                          {h.status === 'open' ? 'Close' : 'Open'}
                        </button>
                        <button className="btn btn--danger" onClick={() => handleDelete(h)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
 