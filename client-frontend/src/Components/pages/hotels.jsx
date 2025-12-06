import React from "react";

export default function Hotels({ user }) {
	return (
		<section className="page">
			<h2>Hotels</h2>
			<p className="muted">Welcome {user?.email ?? "guest"} — browse available hotels below.</p>
			<div className="hotels-grid">
				<div className="hotel-card">Example Hotel 1</div>
				<div className="hotel-card">Example Hotel 2</div>
				<div className="hotel-card">Example Hotel 3</div>
			</div>
		</section>
	);
}
