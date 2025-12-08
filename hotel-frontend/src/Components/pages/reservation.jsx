import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReservationsByHotelId,
  updateReservation,
  deleteReservation,
} from "../slice/slice/reservationSlice";
import { fetchClients } from "../slice/slice/clientSlice";

export default function Reservation({ user, HotelStatus }) {
  const dispatch = useDispatch();
  const { reservations, status, error } = useSelector((state) => state.reservations);
  const { clients } = useSelector((state) => state.clients);
  const [editing, setEditing] = useState({}); // track per-reservation pending state

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchReservationsByHotelId(user.id));
    }
  }, [dispatch, user]);

  // ensure we have client records to show names
  useEffect(() => {
    if (!clients || clients.length === 0) dispatch(fetchClients());
  }, [dispatch, clients]);

  const handleStatusChange = async (reservationId, newStatus) => {
    setEditing((s) => ({ ...s, [reservationId]: true }));
    try {
      await dispatch(updateReservation({ reservationId, updatedData: { status: newStatus } })).unwrap();
      // refresh list for this hotel
      if (user?.id) dispatch(fetchReservationsByHotelId(user.id));
    } catch (err) {
      console.error(err);
      alert("Failed to update reservation status");
    } finally {
      setEditing((s) => ({ ...s, [reservationId]: false }));
    }
  };

  const handleDelete = async (reservationId) => {
    if (!confirm("Delete this reservation?")) return;
    try {
      await dispatch(deleteReservation(reservationId)).unwrap();
      if (user?.id) dispatch(fetchReservationsByHotelId(user.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete reservation");
    }
  };

  if (HotelStatus === null) {
    return (
      <div className="container page">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (HotelStatus === "closed") {
    return (
      <div className="container page">
        <h2>Reservations</h2>
        <p>Your hotel is currently closed. Open it to see and manage reservations.</p>
      </div>
    );
  }

  return (
    <div className="container page reservations-admin-page">
      <h2>Reservations</h2>

      {status === "loading" && <div className="card">Loading reservations...</div>}
      {status === "failed" && <div className="card alert alert--error">{error || "Failed to load reservations"}</div>}

      {status === "succeeded" && reservations.length === 0 && (
        <div className="card">No reservations found for your hotel.</div>
      )}

      {status === "succeeded" && reservations.length > 0 && (
        <div className="card">
          <div className="table-wrap">
            <table className="reservations-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => {
                  const client = clients.find((c) => c._id === r.clientId || c.userId === r.clientId);
                  const created = r.createdAt ? new Date(r.createdAt).toLocaleString() : "-";
                  return (
                    <tr key={r._id || r.id}>
                      <td>{client ? `${client.firstName || client.name || client.userId}` : r.clientId}</td>
                      <td>{r.roomNumber}</td>
                      <td>
                        <select
                          className="input"
                          value={r.status}
                          onChange={(e) => handleStatusChange(r._id, e.target.value)}
                          disabled={!!editing[r._id]}
                        >
                          <option value="booked">booked</option>
                          <option value="checked-in">checked-in</option>
                          <option value="checked-out">checked-out</option>
                          <option value="canceled">canceled</option>
                        </select>
                      </td>
                      <td className="muted">{created}</td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn btn--ghost btn--sm" onClick={() => handleDelete(r._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
