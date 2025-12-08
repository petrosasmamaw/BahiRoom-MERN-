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

  const hotel = hotels.find((h) => h._id === id);

  useEffect(() => {
    dispatch(fetchHotelById(id));
    dispatch(fetchRoomsByHotelId(id));
  }, [dispatch, id]);

  if (!hotel) return <div className="loading">Loading hotel...</div>;

  return (
    <section className="page hotel-detail-page">
      
      {/* HOTEL INFO */}
      <div className="hotel-info">
        <h2 className="hotel-title">{hotel.hotelName}</h2>
        <p className="hotel-location">📍 {hotel.location}</p>
        <p className="hotel-status">Status: {hotel.status}</p>
      </div>

      <hr className="divider" />

      {/* ROOMS LIST */}
      <div className="room-list">
        <h3 className="section-title">Rooms</h3>

        {rooms.length === 0 ? (
          <p className="empty-text">No rooms found for this hotel.</p>
        ) : (
          rooms.map((room) => (
            <div key={room._id} className="room-card">
              <h4 className="room-type">{room.roomType}</h4>
              <p className="room-price">Price: {room.roomPrice} Birr</p>
              <p className="room-description">{room.description}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
