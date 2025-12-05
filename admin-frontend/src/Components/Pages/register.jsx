import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpWithEmail } from "../Slices/supabaseClient.js";

export default function Register() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [info, setInfo] = useState("");

	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setInfo("");
		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}
		setLoading(true);
		const { error } = await signUpWithEmail({ email, password });
		setLoading(false);
		if (error) {
			setError(error.message);
			return;
		}
		setInfo("Check your email to confirm your account.");
		// Optionally route to login after a short delay
		setTimeout(() => navigate("/login"), 1200);
	};

	return (
		<section className="auth">
			<div className="card auth__card">
				<h1 className="auth__title">Create account</h1>
				<p className="auth__subtitle">Register to manage BahiRoom</p>
				{error && <div className="alert alert--error">{error}</div>}
				{info && <div className="alert alert--info">{info}</div>}
				<form onSubmit={onSubmit} className="form">
					<label className="label">
						<span>Email</span>
						<input
							className="input"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							autoComplete="email"
							required
						/>
					</label>
					<label className="label">
						<span>Password</span>
						<input
							className="input"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Create a password"
							autoComplete="new-password"
							required
							minLength={6}
						/>
					</label>
					<label className="label">
						<span>Confirm password</span>
						<input
							className="input"
							type="password"
							value={confirm}
							onChange={(e) => setConfirm(e.target.value)}
							placeholder="Repeat password"
							autoComplete="new-password"
							required
							minLength={6}
						/>
					</label>
					<button className="btn btn--primary btn--block" disabled={loading}>
						{loading ? "Creating…" : "Create Account"}
					</button>
				</form>
				<p className="auth__alt">
					Already have an account? <Link to="/login">Sign in</Link>
				</p>
			</div>
		</section>
	);
}
