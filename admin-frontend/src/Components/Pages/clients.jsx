import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients, updateClient, deleteClient } from "../Slices/slice/clientSlice";

export default function Clients() {
	const dispatch = useDispatch();
	const { clients, status, error } = useSelector((state) => state.clients);

	useEffect(() => {
		dispatch(fetchClients());
	}, [dispatch]);

	const handleToggleStatus = (client) => {
		const newStatus = client.status === "active" ? "inactive" : "active";
		dispatch(updateClient({ clientId: client._id, updatedData: { status: newStatus } }));
	};

	const handleDelete = (client) => {
		if (!window.confirm(`Delete client ${client.name}? This action cannot be undone.`)) return;
		dispatch(deleteClient(client._id));
	};

	return (
		<section className="admin-section">
			<div className="container">
				<h1 className="page-title">Clients</h1>
				<p className="muted">List and manage client accounts.</p>

				<div className="card clients-card">
					{status === "loading" && <div className="clients-loading">Loading clients...</div>}
					{status === "failed" && <div className="alert alert--error">{error || 'Failed to load clients'}</div>}

					{status === "succeeded" && clients.length === 0 && <div className="clients-empty">No clients found.</div>}

					{clients.length > 0 && (
						<div className="clients-table-wrap">
							<table className="clients-table">
								<thead>
									<tr>
										<th>Name</th>
										<th>User ID</th>
										<th>ID Card</th>
										<th>Phone</th>
										<th>Status</th>
										<th>Image</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{clients.map((c) => (
										<tr key={c._id}>
											<td>{c.name}</td>
											<td>{c.userId}</td>
											<td>{c.idCardNo}</td>
											<td>{c.phone}</td>
											<td>
												<span className={`status-badge ${c.status === 'active' ? 'status-active' : 'status-inactive'}`}>{c.status}</span>
											</td>
											<td>
												{c.image ? <img src={c.image} alt={c.name} className="img-thumb" /> : <span className="muted">No image</span>}
											</td>
											<td className="actions-cell">
												<button className="btn btn--ghost" onClick={() => handleToggleStatus(c)}>
													{c.status === 'active' ? 'Deactivate' : 'Activate'}
												</button>
												<button className="btn btn--danger" onClick={() => handleDelete(c)}>
													Delete
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
