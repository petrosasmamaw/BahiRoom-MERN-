import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../Slices/supabaseClient.js";

export default function Navbar({ user }) {
	const navigate = useNavigate();

	const handleLogout = async () => {
		await signOut();
		navigate("/login");
	};

	return (
		<header className="nav">
			<div className="nav__inner">
				<NavLink to="/" className="nav__brand">
					BahiRoom Admin
				</NavLink>
				{user && (
					<nav className="nav__links">
						<NavLink to="/" end className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}>
							Dashboard
						</NavLink>
						<NavLink to="/clients" className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}>
							Clients
						</NavLink>
						<NavLink to="/hotels" className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}>
							Hotels
						</NavLink>
						<NavLink to="/reservations" className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}>
							Reservations
						</NavLink>
					</nav>
				)}
				<div className="nav__auth">
					{user ? (
						<>
							<span className="nav__link" style={{ pointerEvents: "none" }}>
								{user.email}
							</span>
							<button className="btn btn--ghost" onClick={handleLogout}>
								Logout
							</button>
						</>
					) : (
						<>
							<NavLink to="/login" className={({ isActive }) => `btn btn--ghost ${isActive ? "is-active" : ""}`}>
								Login
							</NavLink>
							<NavLink to="/register" className="btn btn--primary">
								Register
							</NavLink>
						</>
					)}
				</div>
			</div>
		</header>
	);
}

