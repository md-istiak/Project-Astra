import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setBusy(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) setMessage(error.message);

    setBusy(false);
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <p className="eyebrow">ASTRA // MISSION ACCESS</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to your mission dashboard.</p>

        <label>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
        />

        <button disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>

        {message && <p className="message">{message}</p>}

        <p className="muted">
          New to ASTRA? <Link to="/signup">Create an account</Link>
        </p>
      </form>
    </main>
  );
}