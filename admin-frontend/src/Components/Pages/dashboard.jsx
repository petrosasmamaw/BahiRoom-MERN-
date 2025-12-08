import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients } from "../Slices/slice/clientSlice";
import { fetchHotels } from "../Slices/slice/hotelSlice";
import { fetchRooms } from "../Slices/slice/roomSlice";
import { fetchReservations } from "../Slices/slice/reservationSlice";

export default function Dashboard() {
	const dispatch = useDispatch();
	const { clients } = useSelector((state) => state.clients);
	const { hotels } = useSelector((state) => state.hotels);
	const { rooms } = useSelector((state) => state.rooms);
	const { reservations } = useSelector((state) => state.reservations);

	useEffect(() => {
		dispatch(fetchClients());
		dispatch(fetchHotels());
		dispatch(fetchRooms());
		dispatch(fetchReservations());
	}, [dispatch]);

	const clientCount = Array.isArray(clients) ? clients.length : 0;
	const hotelCount = Array.isArray(hotels) ? hotels.length : 0;
	const roomCount = Array.isArray(rooms) ? rooms.length : 0;
	const reservationCount = Array.isArray(reservations) ? reservations.length : 0;

	return (
		<section className="admin-section dashboard">
			<div className="dashboard-header">
				<div>
					<h1>Dashboard</h1>
					<p className="muted">Overview of your platform metrics</p>
				</div>
			</div>

			<div className="stats-grid">
				<div className="stat-card">
					<div className="stat-icon bg--blue">👥</div>
					<div className="stat-body">
						<div className="stat-label">Clients</div>
						<div className="stat-value">{clientCount}</div>
						<div className="stat-sub muted">Total registered clients</div>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon bg--teal">🏨</div>
					<div className="stat-body">
						<div className="stat-label">Hotels</div>
						<div className="stat-value">{hotelCount}</div>
						<div className="stat-sub muted">Active hotel partners</div>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon bg--purple">🛏️</div>
					<div className="stat-body">
						<div className="stat-label">Rooms</div>
						<div className="stat-value">{roomCount}</div>
						<div className="stat-sub muted">Total rooms listed</div>
					</div>
				</div>

				<div className="stat-card">
					<div className="stat-icon bg--orange">📅</div>
					<div className="stat-body">
						<div className="stat-label">Reservations</div>
						<div className="stat-value">{reservationCount}</div>
						<div className="stat-sub muted">Recent bookings</div>
					</div>
				</div>
			</div>

			<div className="charts-grid">
				<div className="chart-card">
					<div className="chart-title">Reservations (last 7 days)</div>
					<Sparkline data={getLastNDaysCounts(reservations, 7)} />
				</div>

				<div className="chart-card">
					<div className="chart-title">Reservation status distribution</div>
					<StatusBars reservations={reservations} />
				</div>
			</div>

		</section>
	);
}

// Helper: returns array of counts for last N days (oldest -> newest)
function getLastNDaysCounts(items = [], n = 7) {
	const msPerDay = 24 * 60 * 60 * 1000;
	const today = new Date();
	// build labels for the days (midnight)
	const days = [];
	for (let i = n - 1; i >= 0; i--) {
		const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
		d.setUTCDate(d.getUTCDate() - i);
		days.push(d);
	}

	const counts = days.map((dayStart) => {
		const dayEnd = new Date(dayStart.getTime() + msPerDay);
		return items.filter((r) => {
			const t = r.createdAt ? new Date(r.createdAt).getTime() : 0;
			return t >= dayStart.getTime() && t < dayEnd.getTime();
		}).length;
	});
	return counts;
}

function Sparkline({ data = [] }) {
	const w = 220;
	const h = 48;
	const max = Math.max(...data, 1);
	const step = data.length > 1 ? w / (data.length - 1) : w;
	const points = data.map((v, i) => `${i * step},${h - (v / max) * (h - 8)}`).join(" ");
	const area = data.map((v, i) => `${i * step},${h - (v / max) * (h - 8)}`).join(" L ");

	return (
		<svg className="sparkline" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
			<polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={points} />
			<polygon fill="rgba(96,165,250,0.12)" points={`0,${h} ${area} ${w},${h}`} />
		</svg>
	);
}

function StatusBars({ reservations = [] }) {
	const totals = reservations.reduce(
		(acc, r) => {
			acc[r.status] = (acc[r.status] || 0) + 1;
			return acc;
		},
		{ booked: 0, 'checked-in': 0, 'checked-out': 0, canceled: 0 }
	);
	const total = Object.values(totals).reduce((s, v) => s + v, 0) || 1;
	const rows = Object.entries(totals);

	return (
		<div className="status-bars">
			{rows.map(([status, count]) => (
				<div className="status-row" key={status}>
					<div className="status-label">{status}</div>
					<div className="status-bar-wrap">
						<div
							className={`status-bar status-${status.replace(/[^a-z0-9\-]/gi, '')}`}
							style={{ width: `${(count / total) * 100}%` }}
						/>
					</div>
					<div className="status-count">{count}</div>
				</div>
			))}
		</div>
	);
}
