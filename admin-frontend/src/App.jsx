import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Components/Pages/dashboard.jsx";
import Clients from "./Components/Pages/clients.jsx";
import Hotels from "./Components/Pages/hotels.jsx";
import Reservations from "./Components/Pages/reservations.jsx";
import Login from "./Components/Pages/login.jsx";
import Register from "./Components/Pages/register.jsx";
import Navbar from "./Components/Pages/navbar.jsx";

import { getCurrentUser, supabase } from "./Components/Slices/supabaseClient.js";

function App() {
  const [user, setUser] = useState(null);

  // Load current user + listen to auth changes
  useEffect(() => {
    getCurrentUser().then(setUser);

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getCurrentUser().then(setUser);
    });

    return () => listener?.subscription?.unsubscribe?.();
  }, []);

  return (
    <>
      <Navbar user={user} />

      <main className="container">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
        </Routes>
      </main>
    </>
  );
}

export default App;
