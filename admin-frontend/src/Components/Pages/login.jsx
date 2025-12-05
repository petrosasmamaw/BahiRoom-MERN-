import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmail } from "../Slices/supabaseClient.js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await signInWithEmail({ email, password });
    if (error) return setError(error.message);

    navigate("/"); // Redirect to dashboard
  };

  return (
    <section className="auth">
      <div className="card auth__card">
        <h1 className="auth__title">Login</h1>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={onSubmit} className="form">
          <label className="label">
            <span>Email</span>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="label">
            <span>Password</span>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="btn btn--primary btn--block">Sign In</button>
        </form>

        <p className="auth__alt">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}
