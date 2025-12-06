import React from "react";
import { Link } from "react-router-dom";
import { supabase } from "../slice/supabaseClient";

export default function Navbar({ user }) {
  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link className="nav__brand" to="/">BahiRoom Hotel</Link>

        <div className="nav__links">
          {!user && (
            <>
              <Link className="nav__link" to="/login">Login</Link>
              <Link className="nav__link" to="/register">Register</Link>
            </>
          )}

          {user && (
            <>
              <Link className="nav__link" to="/">Profile</Link>
              <Link className="nav__link" to="/rooms">Rooms</Link>
              <Link className="nav__link" to="/create-room">Create Room</Link>
              <Link className="nav__link" to="/reservation">Reservation</Link>
              <button className="btn btn--ghost" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
