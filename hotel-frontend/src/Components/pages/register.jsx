import React, { useState } from "react";
import { signUpWithEmail } from "../slice/supabaseClient";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { error } = await signUpWithEmail({ email, password });
    if (error) setError(error.message);
  };

  return (
    <section className="auth">
      <div className="card auth__card">
        <h1 className="auth__title">Register</h1>

        {error && <div className="alert alert--error">{error}</div>}

        <form onSubmit={onSubmit} className="form">
          <label className="label">
            <span>Email</span>
            <input
              className="input"
              type="email"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button className="btn btn--primary btn--block">Register</button>
        </form>

        <p className="auth__alt">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}
