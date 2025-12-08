import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { fetchHotelById } from "../slice/slice/hotelSlice";
import { fetchRoomsByHotelId } from "../slice/slice/roomSlice";

export default function HotelDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { hotels } = useSelector((state) => state.hotels);
  const { rooms } = useSelector((state) => state.rooms);

  // Find the hotel by ID
  const hotel = hotels.find((h) => h._id === id);

  // Fetch hotel first
  useEffect(() => {
    dispatch(fetchHotelById(id));
  }, [dispatch, id]);

  // Fetch rooms after hotel is loaded
  useEffect(() => {
    if (hotel?._id) {
      // Some rooms in DB may store hotelId as the hotel's userId (legacy).
      // Try fetching by userId first, fall back to hotel _id.
      const identifier = hotel.userId || hotel._id;
      dispatch(fetchRoomsByHotelId(identifier));
    }
  }, [dispatch, hotel]);

  if (!hotel) return <div className="loading">Loading hotel...</div>;

  const hotelName = hotel.name || "Untitled Hotel";
  const hotelAddress = hotel.address || "Address not provided";
  const hotelImage = hotel.image || null;
  const hotelPhone = hotel.phone || null;

  return (
    <section className="page hotel-detail-page">

      {/* HOTEL INFO */}
      <div className="hotel-info">
        <div className="hotel-media">
          {hotelImage ? (
            <img src={hotelImage} alt={hotelName} className="hotel-thumb" />
          ) : (
            <div className="hotel-media--placeholder">No image</div>
          )}
        </div>

        <div className="hotel-meta-block">
          <h2 className="hotel-title">{hotelName}</h2>
          <p className="hotel-location">📍 {hotelAddress}</p>
          {hotelPhone && <p className="hotel-phone">☎ {hotelPhone}</p>}
          <p className="hotel-status">Status: <strong>{hotel.status || 'unknown'}</strong></p>
          <p className="hotel-created muted">Joined: {new Date(hotel.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <hr className="divider" />

      {/* ROOMS LIST */}
      <div className="room-list">
        <h3 className="section-title">Rooms</h3>

        {(!rooms || rooms.length === 0) ? (
          <p className="empty-text">No rooms found for this hotel.</p>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className="room-card">
              <div className="room-row">
                <div className="room-media-small">
                  {room.images?.length > 0 ? (
                    <img src={room.images[0]} alt={room.roomNumber || room.type} />
                  ) : (
                    <div className="media-placeholder">No image</div>
                  )}
                </div>

                <div className="room-info">
                  <div className="room-head">
                    <h4 className="room-type">{room.roomNumber || room.type || 'Room'}</h4>
                    <div className="room-badges">
                      <span className={`badge ${room.status === 'available' ? 'badge--success' : 'badge--muted'}`}>{room.status || 'unknown'}</span>
                      {room.rating != null && <span className="badge">⭐ {room.rating.toFixed ? room.rating.toFixed(1) : room.rating}</span>}
                    </div>
                  </div>

                  <p className="room-price">Price: {room.price || 'N/A'} Birr</p>
                  <p className="room-description">{room.description}</p>

                  <div className="room-actions">
                    <button className="btn btn--ghost btn--sm">Edit</button>
                    <button className="btn btn--primary btn--sm">View</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
