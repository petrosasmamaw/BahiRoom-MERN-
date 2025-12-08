import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomsByHotelId, deleteRoom } from "../slice/slice/roomSlice";
import { useState } from "react";

const Rooms = ({ user }) => {
  const dispatch = useDispatch();
  const { rooms, status, error } = useSelector((state) => state.rooms);
   const [deletingId, setDeletingId] = useState(null);
   const [actionMessage, setActionMessage] = useState(null);

  // Fetch rooms for this hotel
  useEffect(() => {
    if (user?.id ) {
      dispatch(fetchRoomsByHotelId(user?.id));
    }
  }, [dispatch, user]);

  if (!user) return <div className="card">No user logged in.</div>;
  if (!user?.id) return <div className="card">No hotel found for this user.</div>;

  const filteredRooms = rooms.filter((r) => r.hotelId === user?.id);
   const handleDelete = async (roomId) => {
     const ok = window.confirm("Delete this room? This action cannot be undone.");
     if (!ok) return;
     try {
       setActionMessage(null);
       setDeletingId(roomId);
       await dispatch(deleteRoom(roomId)).unwrap();
       setActionMessage("Room deleted");
     } catch (err) {
       setActionMessage(err.message || "Failed to delete room");
     } finally {
       setDeletingId(null);
       setTimeout(() => setActionMessage(null), 2500);
     }
   };

  return (
    <div>
      <h2 className="page-title">Rooms</h2>
      <div className="page-subtitle">Rooms for your hotel</div>

      {status === "loading" && <div className="card">Loading rooms...</div>}
      {status === "failed" && <div className="card alert alert--error">{error}</div>}
      {actionMessage && <div className="card">{actionMessage}</div>}

      <div className="grid--rooms" style={{ marginTop: 12 }}>
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div key={room._id} className="card room-card">
              <div className="room-media">
                {room.images?.length > 0 ? (
                  <img className="room-thumb" src={room.images[0]} alt={room.roomNumber} />
                ) : (
                  <div className="room-thumb--placeholder">No image</div>
                )}
              </div>

              <div className="room-body">
                <div className="room-title">
                  Room {room.roomNumber} — {room.type}
                </div>
                <div className="room-meta">
                  Price: ${room.price} • Status: {room.status}
                </div>
                <div className="room-desc">{room.description}</div>
                  <div style={{ marginTop: 8 }}>
                    <button
                      className="btn btn--danger"
                      disabled={deletingId === room._id}
                      onClick={() => handleDelete(room._id)}
                    >
                      {deletingId === room._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card">No rooms found for this hotel.</div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
