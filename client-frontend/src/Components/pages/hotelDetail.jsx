import React from "react";
import { useParams } from "react-router-dom";

export default function HotelDetail({ user }) {
	const { id } = useParams();
	return (
		<section className="page">
			<h2>Hotel Detail</h2>
			<p className="muted">Hotel id: {id}</p>
			<div className="hotel-detail">Details for hotel #{id} would appear here.</div>
		</section>
	);
}
