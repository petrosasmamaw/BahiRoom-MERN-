import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:5001/api/hotel";

export default function Hotels({ user, clientStatus }) {
	const [hotels, setHotels] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;
		const fetchHotels = async () => {
			try {
				const res = await axios.get(API);
				if (mounted) setHotels(res.data || []);
			} catch (err) {
				if (mounted) setError(err.message || "Failed to load hotels");
			} finally {
				if (mounted) setLoading(false);
			}
		};
		fetchHotels();
		return () => (mounted = false);
	}, []);

	if (clientStatus === "inactive") {
		return (
			<section className="page">
				<h2>Hotels</h2>
				<p className="muted">Welcome {user?.email ?? "guest"}</p>
				<div className="card">
					<p>
						Your account is inactive. Please contact the administrator to reactivate
						access.
					</p>
				</div>
			</section>
		);
	}

	if (clientStatus === "active") {
		return (
			<section className="page">
				<h2>Hotels</h2>
				<p className="muted">Welcome {user?.email ?? "guest"}</p>
				<div className="card">
					<p>Hotel features are coming soon for active clients.</p>
				</div>
			</section>
		);
	}

	return (
		<section className="page">
			<h2>Hotels</h2>
			<p className="muted">Welcome {user?.email ?? "guest"}</p>

			{loading && <div className="card">Loading hotels...</div>}
			{error && <div className="card alert alert--error">{error}</div>}

			{!loading && !error && (
				<div className="hotels-grid">
					{hotels.length === 0 && (
						<div className="card">No hotels available yet.</div>
					)}

					{hotels.map((hotel) => (
						<Link
							to={`/hotels/${hotel._id || hotel.id}`}
							key={hotel._id || hotel.id}
							className="hotel-card"
						>
							{hotel.image ? (
								<img
									src={hotel.image}
									alt={hotel.name}
									style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 12 }}
								/>
							) : null}
							<h3 style={{ margin: "0 0 6px" }}>{hotel.name}</h3>
							<div className="muted" style={{ marginBottom: 8 }}>{hotel.address}</div>
							<div style={{ fontSize: 14, color: "var(--muted)"}}>Phone: {hotel.phone}</div>
						</Link>
					))}
				</div>
			)}
		</section>
	);
}