import React from "react";

export default function Profile({ user }) {
	return (
		<section className="page">
			<h2>Profile</h2>
			<p className="muted">Signed in as: {user?.email}</p>
			<div className="card">Profile information would go here.</div>
		</section>
	);
}
