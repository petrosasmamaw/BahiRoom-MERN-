import React from "react";

export default function Hotels({ user, clientStatus }) {
	// If clientStatus is inactive -> show contact admin message
	if (clientStatus === 'inactive') {
		return (
			<section className="page">
				<h2>Hotels</h2>
				<p className="muted">Welcome {user?.email ?? 'guest'}</p>
				<div className="card">
					<p>Your account is inactive. Please contact the administrator to reactivate access.</p>
				</div>
			</section>
		);
	}
	// If clientStatus indicates an "active" state, show a "features available soon" message
	if (clientStatus === 'active') {
		return (
			<section className="page">
				<h2>Hotels</h2>
				<p className="muted">Welcome {user?.email ?? 'guest'}</p>
				<div className="card">
					<p>Hotel features are coming soon for active clients.</p>
				</div>
			</section>
		);
	}
}