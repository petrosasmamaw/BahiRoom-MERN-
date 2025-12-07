import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientById, addClient, updateClient } from "../slice/slice/clientSlice";

export default function Profile({ user }) {

  const dispatch = useDispatch();

  const { clients, status, error } = useSelector((state) => state.clients);
  const existingClient = clients.find(c => c.userId === user?.id);

  const [form, setForm] = useState({
	name: "",
	email: "",
	phone: "",
	idCardNo: "",
	image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
	if (user?.id) {
	  dispatch(fetchClientById(user.id));   
	}}, [dispatch, user]);

	useEffect(() => {
		if (existingClient) {
			setForm({
				name: existingClient.name,
				email: existingClient.email,
				phone: existingClient.phone,
				idCardNo: existingClient.idCardNo,
				image: existingClient.image
			});
			if (existingClient.image) setPreview(existingClient.image);
		}
	}, [existingClient]);

  const handleChange = (e) => {
	const { name, value } = e.target;
	setForm({ ...form, [name]: value });
  };
  const handleFileChange = (e) => {
	const file = e.target.files && e.target.files[0];
	if (file) {
	  setImageFile(file);
	  const url = URL.createObjectURL(file);
	  setPreview(url);
	} else {
	  setImageFile(null);
	}};

  const handleSubmit = (e) => {
	e.preventDefault();
	const clientData = {
	  ...form,
	  userId: user.id,
	  imageFile: imageFile
	};
	if (existingClient) {
	  dispatch(updateClient({ clientId: existingClient._id, updatedData: clientData }));
	} else {
	  dispatch(addClient(clientData));
	}
	  };

	return (
		<div className="container profile-page">
			<div className="page-title">{existingClient ? "Edit Your Profile" : "Create Your Profile"}</div>
			<div className="page-subtitle">Manage your contact information</div>

			<div className="card profile-card">
				<div className="profile-header">
					<div className="profile-avatar-wrap">
						{preview ? (
							<img src={preview} alt="avatar" className="profile-avatar" />
						) : (
							<div className="profile-avatar profile-avatar--placeholder">U</div>
						)}
					</div>
					<div className="profile-info">
						<h3 className="profile-name">{form.name || (existingClient ? existingClient.name : 'Your Name')}</h3>
						<div className="profile-meta">{existingClient ? 'Registered client' : 'Create your profile'}</div>
					</div>
				</div>

				<div className="profile-body">
					<form className="form profile-form" onSubmit={handleSubmit}>
						<label className="label">Full name
							<input className="input" name="name" value={form.name} onChange={handleChange} />
						</label>

						<label className="label">Email
							<input className="input" name="email" value={user.email} onChange={handleChange} />
						</label>

						<label className="label">Phone
							<input className="input" name="phone" value={form.phone} onChange={handleChange} />
						</label>

						<label className="label">ID Card No
							<input className="input" name="idCardNo" value={form.idCardNo} onChange={handleChange} />
						</label>

						<label className="label">Attach Image
							<input className="input" type="file" accept="image/*" name="imageFile" onChange={handleFileChange} />
						</label>

						<div className="profile-actions">
							<button className="btn btn--primary btn--block" type="submit">
								{existingClient ? 'Update Profile' : 'Create Profile'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}