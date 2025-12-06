import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../slice/supabaseClient.js";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand">BahiRoom</NavLink>

        {user && (
          <nav className="nav__links">
            <NavLink to="/" className="nav__link">Hotels</NavLink>
            <NavLink to="/profile" className="nav__link">Profile</NavLink>
            <NavLink to="/reservations" className="nav__link">Reservations</NavLink>
          </nav>
        )}

        <div className="nav__auth">
          {user ? (
            <>
              <span className="nav__link">{user.email}</span>
              <button className="btn btn--ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn--ghost">Login</NavLink>
              <NavLink to="/register" className="btn btn--primary">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
