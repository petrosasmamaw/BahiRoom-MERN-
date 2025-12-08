import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchReservationsByClientId,
	updateReservation,
} from "../slice/slice/reservationSlice";
import { fetchHotels } from "../slice/slice/hotelSlice";

export default function Reservation({ user, clientStatus }) {
	const dispatch = useDispatch();
	const { reservations, status, error } = useSelector((state) => state.reservations);
	const { hotels } = useSelector((state) => state.hotels);

	// Fetch reservations when user is available
	useEffect(() => {
		if (user?.id) {
			dispatch(fetchReservationsByClientId(user.id));
		}
	}, [dispatch, user]);

	// Ensure hotels list is populated so we can show hotel names
	useEffect(() => {
		if (!hotels || hotels.length === 0) {
			dispatch(fetchHotels());
		}
	}, [dispatch, hotels]);

	// If client is inactive -> instruct to contact admin
	if (clientStatus === "inactive") {
		return (
			<main className="page reservations-page">
				<div className="container">
					<h1>Reservations</h1>
					<div className="card">
						<p>Your account is inactive. Please contact the administrator to enable reservation features.</p>
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className="page reservations-page">
			<div className="container">
				<h1>Reservations</h1>

				{status === "loading" && (
					<div className="card">
						<p>Loading reservations...</p>
					</div>
				)}

				{status === "failed" && (
					<div className="card alert alert--error">{error || "Failed to load reservations."}</div>
				)}

				{status === "succeeded" && reservations.length === 0 && (
					<div className="card">
						<p>No reservations found.</p>
					</div>
				)}

				{status === "succeeded" && reservations.length > 0 && (
					<div className="reservations-list">
						{reservations.map((r) => {
							const hotel = hotels.find((h) => h._id === r.hotelId || h.userId === r.hotelId);
							const created = r.createdAt ? new Date(r.createdAt).toLocaleString() : "-";
							const updated = r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "-";

							const badgeClass = r.status === "booked"
								? "badge--primary"
								: r.status === "checked-in"
								? "badge--info"
								: r.status === "checked-out"
								? "badge--muted"
								: r.status === "canceled"
								? "badge--danger"
								: "";

							return (
								<div className="reservation-card" key={r._id || r.id}>
									<div className="reservation-main">
										<div className="reservation-meta">
											<div className="reservation-hotel">{hotel?.name || r.hotelId} HOTEL</div>
											<div className="reservation-room">Room: {r.roomNumber}</div>
											<div className="reservation-times muted">Created: {created} • Updated: {updated}</div>
										</div>

										<div className="reservation-right">
											<div className={`badge ${badgeClass}`}>{r.status}</div>
											{r.status === "booked" && (
												<button
													className="btn btn--ghost btn--sm"
													onClick={async () => {
														if (!confirm("Cancel this reservation?")) return;
														try {
															await dispatch(updateReservation({ reservationId: r._id, updatedData: { status: "canceled" } })).unwrap();
															// refresh
															dispatch(fetchReservationsByClientId(user.id));
														} catch (err) {
															console.error(err);
															alert("Failed to cancel reservation.");
														}
													}}
												>
													Cancel
												</button>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</main>
	);
}
