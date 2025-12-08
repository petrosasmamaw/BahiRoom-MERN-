import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/pages/navbar";
import Login from "./Components/pages/login";
import Register from "./Components/pages/register";
import Profile from "./Components/pages/profile";
import Rooms from "./Components/pages/rooms";
import CreateRoom from "./Components/pages/createRoom";
import Reservation from "./Components/pages/reservation";
import { supabase } from "./Components/slice/supabaseClient";
import { fetchHotelById } from "./Components/slice/slice/hotelSlice";
import { useSelector, useDispatch } from "react-redux";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [HotelStatus, setHotelStatus] = useState(null);
  const dispatch = useDispatch();
 
  const { hotels, status, error } = useSelector((state) => state.hotels);
  // When a user is available, fetch their hotel (thunk expects the user id)
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchHotelById(user.id));
    }
  }, [dispatch, user]);

  // Keep local HotelStatus in sync with the hotel data from the store
  useEffect(() => {
    const myHotel = hotels.find((h) => h.userId === user?.id);
    setHotelStatus(myHotel?.status ?? null);
  }, [hotels, user]);
   
 

  // Listen to login/logout
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Navbar user={user} />

      <Routes>
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}

        {user && (
          <>
            <Route path="/" element={<Profile user={user} />} />
            <Route path="/rooms" element={<Rooms user={user} HotelStatus={HotelStatus} /> } />
            <Route path="/create-room" element={<CreateRoom user={user} HotelStatus={HotelStatus}/>} />
            <Route path="/reservation" element={<Reservation HotelStatus={HotelStatus}/>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
