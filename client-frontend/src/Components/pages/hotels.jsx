import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotels } from "../slice/slice/hotelSlice";
import { Link } from "react-router-dom";

export default function Hotels() {
  const dispatch = useDispatch();
  const { hotels, status, error } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch]);

  if (status === "loading") return <div className="loading">Loading hotels...</div>;
  if (status === "failed") return <div className="error">{error}</div>;

  return (
    <section className="page hotels-page">
      <h2 className="page-title">Hotels</h2>

      <div className="hotel-list">
        {hotels.map((hotel) => (
          <Link 
            key={hotel._id}
            to={`/hotels/${hotel._id}`}
            className="hotel-card"
          >
            <div className="hotel-media">
              {hotel.image ? (
                <img src={hotel.image} alt={hotel.hotelName} className="hotel-thumb" />
              ) : (
                <div className="hotel-media--placeholder">No image</div>
              )}
            </div>

            <div className="hotel-body">
              <h3 className="hotel-name">{hotel.name}</h3>
              <p className="hotel-location">{hotel.address}</p>
              <p className="hotel-status">Status: {hotel.status}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
