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

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
