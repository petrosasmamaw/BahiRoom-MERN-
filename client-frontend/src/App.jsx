import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { supabase, getCurrentUser } from "./Components/slice/supabaseClient";

import Navbar from "./Components/pages/navbar";
import Hotels from "./Components/pages/hotels";
import HotelDetail from "./Components/pages/hotelDetail";
import Profile from "./Components/pages/profile";
import Reservations from "./Components/pages/reservation";
import Login from "./Components/pages/login";
import Register from "./Components/pages/register";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial user load
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const u = await getCurrentUser();
      if (mounted) {
        setUser(u);
        setLoading(false);
      }
    }

    loadUser();

    // Listen for login / logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe?.();
      listener?.unsubscribe?.();
    };
  }, []);

  if (loading) return null; // prevents flash

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} />

        <main className="container">
          <Routes>
            {/* Public */}
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" replace />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" replace />}
            />

            {/* Protected */}
            <Route
              path="/"
              element={user ? <Hotels user={user} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/hotels"
              element={user ? <Hotels user={user} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/hotels/:id"
              element={user ? <HotelDetail user={user} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={user ? <Profile user={user} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/reservations"
              element={user ? <Reservations user={user} /> : <Navigate to="/login" replace />}
            />

            {/* Fallback */}
            <Route
              path="*"
              element={<Navigate to={user ? "/" : "/login"} replace />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
