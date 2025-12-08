import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addRoom, fetchRoomsByHotelId } from "../slice/slice/roomSlice";

const CreateRoom = ({ user, HotelStatus }) => {
  const dispatch = useDispatch();

  const [roomNumber, setRoomNumber] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("available");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // ✅ hotelId = user.id (this is what you requested)
  const hotelId = user?.id;

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const resetForm = () => {
    setRoomNumber("");
    setType("");
    setPrice("");
    setStatus("available");
    setDescription("");
    setFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hotelId) {
      setMessage("Hotel ID (user.id) missing");
      return;
    }

    const formData = new FormData();

    // REQUIRED FIELDS
    formData.append("hotelId", hotelId);
    formData.append("userId", user.id);
    formData.append("roomNumber", roomNumber);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("status", status);
    formData.append("description", description);

    files.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      setMessage(null);

      await dispatch(addRoom(formData)).unwrap();

      setMessage("Room created successfully");
      resetForm();

      dispatch(fetchRoomsByHotelId(hotelId));
    } catch (err) {
      setMessage(err.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="room-form-wrapper card">
      <h2 className="page-title">Create Room</h2>

      {message && <div className="form-message">{message}</div>}

      <form className="room-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-grid">
          <label className="form-row">
            <div className="label">Room Number</div>
            <input className="input" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} required />
          </label>

          <label className="form-row">
            <div className="label">Type</div>
            <input className="input" value={type} onChange={(e) => setType(e.target.value)} required />
          </label>

          <label className="form-row">
            <div className="label">Price</div>
            <input className="input" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </label>

          <label className="form-row">
            <div className="label">Status</div>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </label>

          <label className="form-row">
            <div className="label">User Id (Hotel ID)</div>
            <input className="input" value={user?.id || ""} readOnly />
          </label>
        </div>

        <label>
          <div className="label">Description</div>
          <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <label>
          <div className="label">Images (multiple allowed)</div>
          <input type="file" accept="image/*" multiple onChange={handleFilesChange} />
          {files.length > 0 && (
            <div className="images-list">
              {files.map((f, i) => (
                <div key={i} className="image-item">{f.name}</div>
              ))}
            </div>
          )}
        </label>

        <div style={{ marginTop: 12 }}>
          <button className="btn btn--primary" type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Create Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoom;
