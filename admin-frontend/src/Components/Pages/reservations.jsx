import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReservations } from "../Slices/slice/reservationSlice";
import { fetchClients } from "../Slices/slice/clientSlice";
import { fetchHotels } from "../Slices/slice/hotelSlice";

export default function Reservations() {
	const dispatch = useDispatch();
	const { reservations, status, error } = useSelector((state) => state.reservations);
	const { clients } = useSelector((state) => state.clients);
	const { hotels } = useSelector((state) => state.hotels);

	useEffect(() => {
		dispatch(fetchReservations());
		if (!clients || clients.length === 0) dispatch(fetchClients());
		if (!hotels || hotels.length === 0) dispatch(fetchHotels());
	}, [dispatch]);

	// Sort newest first by createdAt
	const list = Array.isArray(reservations)
		? [...reservations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		: [];

	return (
		<section className="admin-section">
			<h1>Reservations</h1>
			<p className="muted">All reservations (newest first)</p>

			{status === "loading" && <div className="card clients-loading">Loading reservations...</div>}
			{status === "failed" && <div className="card alert alert--error">{error || "Failed to load reservations."}</div>}

			{status === "succeeded" && (
				<div className="clients-card">
					<div className="clients-table-wrap">
						<table className="clients-table reservations-table">
							<thead>
								<tr>
									<th>Client</th>
									<th>Hotel</th>
									<th>Room</th>
									<th>Status</th>
									<th>Created</th>
								</tr>
							</thead>
							<tbody>
								{list.map((r) => {
									const client = clients.find((c) => c._id === r.clientId || c.userId === r.clientId);
									const hotel = hotels.find((h) => h._id === r.hotelId || h.userId === r.hotelId);
									return (
										<tr key={r._id || r.id}>
											<td>{client ? (client.firstName || client.name || client.userId) : r.clientId}</td>
											<td>{hotel ? hotel.name : r.hotelId}</td>
											<td>{r.roomNumber}</td>
											<td><span className={`status-badge ${r.status === 'booked' ? 'status-open' : r.status === 'canceled' ? 'status-closed' : ''}`}>{r.status}</span></td>
											<td className="muted">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</section>
	);
}
