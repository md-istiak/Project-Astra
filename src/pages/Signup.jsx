import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setMessage("");
    setBusy(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      setMessage(error.message);
    } else if (!data.session) {
      setMessage("Account created! Check your email to confirm your account.");
    } else {
      setMessage("Account created successfully!");
    }

    setBusy(false);
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSignup}>
        <p className="eyebrow">ASTRA // CREW REGISTRATION</p>
        <h1>Create your account</h1>
        <p className="muted">Join the mission health monitoring system.</p>

        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your crew username"
          required
        />

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
          placeholder="At least 8 characters"
          minLength={8}
          required
        />

        <button disabled={busy}>
          {busy ? "Creating account..." : "Create account"}
        </button>

        {message && <p className="message">{message}</p>}

        <p className="muted">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}