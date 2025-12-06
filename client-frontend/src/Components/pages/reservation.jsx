import React from "react";

export default function Reservation({ user }) {
	return (
		<main className="page page--reservations">
			<div className="container">
				<h1>Reservations</h1>
				{user ? <p>Reservations for {user.email}</p> : <p>Please sign in to manage reservations.</p>}
			</div>
		</main>
	);
}
