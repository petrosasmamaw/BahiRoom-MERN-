import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelById, addHotel, updateHotel } from "../slice/slice/hotelSlice";

export default function Profile({ user }) {

  const dispatch = useDispatch();

  // Get data from Redux
  const { hotels, status, error } = useSelector((state) => state.hotels);

  // Find hotel belonging to this user
  const existingHotel = hotels.find(h => h.userId === user?.id);

  // Local form state
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Fetch hotel using userId on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchHotelById(user.id));   // your backend should fetch by userId
    }
  }, [dispatch, user]);

  // When existing hotel loads, fill form
  useEffect(() => {
    if (existingHotel) {
      setForm({
        name: existingHotel.name,
        address: existingHotel.address,
        phone: existingHotel.phone,
        image: existingHotel.image
      });
      // set preview to existing image URL if available
      if (existingHotel.image) setPreview(existingHotel.image)
    }
  }, [existingHotel]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setImageFile(null);
      setPreview(form.image || null);
    }
  };

  // Submit form: Create OR Update
  const handleSubmit = () => {
    if (existingHotel) {
      // update
      dispatch(
            updateHotel({
              hotelId: existingHotel._id,
              // include imageFile when a new file was attached; include userId from prop drilling
              updatedData: imageFile ? { ...form, imageFile, userId: user?.id } : { ...form, userId: user?.id }
            })
      );
    } else {
      // create
      dispatch(
          addHotel({
            ...form,
            userId: user?.id,
            imageFile // may be null if no file attached; reducer/backend should handle
          })
      );
    }
  };

  return (
    <div className="container profile-page">
      <div className="page-title">{existingHotel ? "Edit Your Hotel Profile" : "Create Your Hotel Profile"}</div>
      <div className="page-subtitle">Manage your hotel details and contact information</div>

      <div className="card profile-card" role="region" aria-label="Hotel profile">
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            {form.image ? (
              <img src={form.image} alt="hotel" className="profile-avatar" />
            ) : (
              <div className="profile-avatar profile-avatar--placeholder">H</div>
            )}
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{form.name || (existingHotel ? existingHotel.name : 'Your Hotel')}</h3>
            <div className="profile-meta">{existingHotel ? 'Registered hotel' : 'Create a new listing'}</div>
          </div>
        </div>

        <div className="profile-body">
          <div className="form profile-form">
            <label className="label">Name</label>
            <input
              className="input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <label className="label">Address</label>
            <input
              className="input"
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
            />

            <label className="label">Phone</label>
            <input
              className="input"
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <label className="label">Attach Image</label>
            <input
              className="input"
              type="file"
              accept="image/*"
              name="imageFile"
              onChange={handleFileChange}
            />

            {preview && (
              <div style={{ marginTop: 10 }}>
                <img src={preview} alt="preview" className="profile-avatar" style={{ maxWidth: 260, borderRadius: 8 }} />
              </div>
            )}

            <div className="profile-actions">
              <button className="btn btn--primary btn--block" onClick={handleSubmit}>
                {existingHotel ? "Update Profile" : "Create Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
