import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { supabase, getCurrentUser } from "./Components/slice/supabaseClient";
import { fetchClientById } from "./Components/slice/slice/clientSlice";

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
  const dispatch = useDispatch();
  const { clients, status, error } = useSelector((state) => state.clients);
  const [clientStatus, setClientStatus] = useState(null);

  useEffect(() => {
    const myClient = clients.find((c) => c.userId === user?.id);
    setClientStatus(myClient?.status ?? null);
  }, [clients, user]);



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

    // (keep loadUser isolated here) fetch of client happens in a separate effect

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

  // Fetch client record when user becomes available
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchClientById(user.id));
    }
  }, [dispatch, user]);

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
              element={user ? <Hotels user={user} clientStatus={clientStatus} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/hotels"
              element={user ? <Hotels user={user} clientStatus={clientStatus} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/hotels/:id"
              element={user ? <HotelDetail user={user} clientStatus={clientStatus} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={user ? <Profile user={user} clientStatus={clientStatus} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/reservations"
              element={user ? <Reservations user={user} clientStatus={clientStatus} /> : <Navigate to="/login" replace />}
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
