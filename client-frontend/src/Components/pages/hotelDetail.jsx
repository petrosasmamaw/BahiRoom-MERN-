import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const HOTEL_API = "http://localhost:5001/api/hotel";
const ROOM_API = "http://localhost:5001/api/room";

export default function HotelDetail({ user }) {
	const { id } = useParams();
	const [hotel, setHotel] = useState(null);
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let mounted = true;

		const fetchHotelAndRooms = async () => {
			try {
				setLoading(true);
				const resHotel = await axios.get(`${HOTEL_API}/${id}`);
				const h = resHotel.data;
				if (!mounted) return;
				setHotel(h);

				// Use hotel's _id to fetch rooms (fallback to id field)
				const hotelId = h._id || h.id;
				const resRooms = await axios.get(`${ROOM_API}/hotel/${hotelId}`);
				if (!mounted) return;
				setRooms(resRooms.data || []);
			} catch (err) {
				if (mounted) setError(err.message || "Failed to load hotel details");
			} finally {
				if (mounted) setLoading(false);
			}
		};

		fetchHotelAndRooms();
		return () => (mounted = false);
	}, [id]);

	return (
		<section className="page">
			<h2>Hotel Detail</h2>
			<p className="muted">Hotel id: {id}</p>

			{loading && <div className="card">Loading...</div>}
			{error && <div className="card alert alert--error">{error}</div>}

			{hotel && (
				<div className="hotel-detail">
					<div className="hotel-detail-header card">
						{hotel.image ? (
							<img className="hotel-image" src={hotel.image} alt={hotel.name} />
						) : (
							<div className="hotel-image hotel-image--placeholder">{hotel.name?.[0] ?? "H"}</div>
						)}
						<div style={{ marginLeft: 16 }}>
							<h3 style={{ margin: 0 }}>{hotel.name}</h3>
							<div className="muted">{hotel.address}</div>
							<div style={{ marginTop: 8 }}>Phone: {hotel.phone}</div>
							<div style={{ marginTop: 8 }}><strong>Owner ID:</strong> {hotel.userId}</div>
						</div>
					</div>

					<div className="rooms-section" style={{ marginTop: 18 }}>
						<h3>Rooms</h3>
						{rooms.length === 0 && <div className="card">No rooms found for this hotel.</div>}
						<div className="rooms-grid" style={{ marginTop: 12 }}>
							{rooms.map((room) => (
								<div className="room-card" key={room._id || room.id}>
									{room.images && room.images[0] ? (
										<img src={room.images[0]} alt={room.roomNumber || room.type} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginBottom: 8 }} />
									) : null}
									<div style={{ fontWeight: 600 }}>{room.type} {room.roomNumber ? `#${room.roomNumber}` : ""}</div>
									<div className="muted">{room.description}</div>
									<div style={{ marginTop: 8 }}><strong>Price:</strong> ${room.price}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
