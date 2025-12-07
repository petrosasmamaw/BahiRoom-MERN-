import React from "react";

export default function Reservation({ user, clientStatus }) {
	// If client is inactive -> instruct to contact admin
	if (clientStatus === 'inactive') {
		return (
			<main className="page page--reservations">
				<div className="container">
					<h1>Reservations</h1>
					<div className="card">
						<p>Your account is inactive. Please contact the administrator to enable reservation features.</p>
					</div>
				</div>
			</main>
		);
	}

	// If client is active -> features available soon
	if (clientStatus === 'active') {
		return (
			<main className="page page--reservations">
				<div className="container">
					<h1>Reservations</h1>
					<div className="card">
						<p>Reservation features are coming soon for active clients.</p>
					</div>
				</div>
			</main>
		);
	}
}
