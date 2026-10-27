
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Home({ session }) {
  const [updates, setUpdates] = useState([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    weight: "",
    systolic: "",
    diastolic: "",
    sleep_hours: "",
    mood: "Good",
    notes: "",
  });

  async function loadUpdates() {
    const { data, error } = await supabase
      .from("health_updates")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      setMessage(error.message);
    } else {
      setUpdates(data ?? []);
    }
  }

  useEffect(() => {
    loadUpdates();
  }, [session.user.id]);

  function changeField(e) {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function submitUpdate(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    const record = {
      user_id: session.user.id,
      weight: form.weight ? Number(form.weight) : null,
      systolic: form.systolic ? Number(form.systolic) : null,
      diastolic: form.diastolic ? Number(form.diastolic) : null,
      sleep_hours: form.sleep_hours ? Number(form.sleep_hours) : null,
      mood: form.mood,
      notes: form.notes.trim() || null,
    };

    const { error } = await supabase
      .from("health_updates")
      .insert(record);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Health update saved online.");
      setForm({
        weight: "",
        systolic: "",
        diastolic: "",
        sleep_hours: "",
        mood: "Good",
        notes: "",
      });
      await loadUpdates();
    }

    setBusy(false);
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) setMessage(error.message);
  }

  const username =
    session.user.user_metadata?.username ||
    session.user.email?.split("@")[0] ||
    "Crew member";

  return (
    <main className="dashboard">
      <header className="topbar">
        <Link className="brand" to="/">
          ASTRA<span>.</span>
        </Link>
        <button className="secondary" onClick={logout}>
          Sign out
        </button>
      </header>

      <section className="welcome">
        <p className="eyebrow">MISSION HEALTH MONITORING</p>
        <h1>Welcome, {username}</h1>
        <p className="muted">Your personal health dashboard.</p>
      </section>

      <section className="panel">
        <h2>Today's health update</h2>

        <form className="health-form" onSubmit={submitUpdate}>
          <label>
            Weight (kg)
            <input
              name="weight"
              type="number"
              min="1"
              max="500"
              step="0.1"
              value={form.weight}
              onChange={changeField}
            />
          </label>

          <label>
            Systolic blood pressure
            <input
              name="systolic"
              type="number"
              min="50"
              max="300"
              value={form.systolic}
              onChange={changeField}
              placeholder="e.g. 120"
            />
          </label>

          <label>
            Diastolic blood pressure
            <input
              name="diastolic"
              type="number"
              min="30"
              max="200"
              value={form.diastolic}
              onChange={changeField}
              placeholder="e.g. 80"
            />
          </label>

          <label>
            Sleep duration (hours)
            <input
              name="sleep_hours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={form.sleep_hours}
              onChange={changeField}
            />
          </label>

          <label>
            How are you feeling?
            <select
              name="mood"
              value={form.mood}
              onChange={changeField}
            >
              <option>Excellent</option>
              <option>Good</option>
              <option>Okay</option>
              <option>Tired</option>
              <option>Unwell</option>
            </select>
          </label>

          <label className="full-width">
            Additional notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={changeField}
              placeholder="Symptoms, stress, discomfort, or other observations..."
            />
          </label>

          <button type="submit" disabled={busy}>
            {busy ? "Saving..." : "Save health update"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </section>

      <section className="panel">
        <h2>My recent updates</h2>

        {updates.length === 0 ? (
          <p className="muted">No health updates submitted yet.</p>
        ) : (
          <div className="updates-list">
            {updates.map((item) => (
              <article className="update-item" key={item.id}>
                <strong>
                  {new Date(item.created_at).toLocaleString()}
                </strong>
                <p>
                  Weight: {item.weight ?? "—"} kg · Blood pressure:{" "}
                  {item.systolic ?? "—"}/{item.diastolic ?? "—"} · Sleep:{" "}
                  {item.sleep_hours ?? "—"} hours
                </p>
                <p>Mood: {item.mood || "—"}</p>
                {item.notes && <p>{item.notes}</p>}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Mission crew</h2>
        <p className="muted">
          Crew-wide summaries will appear here once mission membership
          and access permissions are configured.
        </p>
      </section>
    </main>
  );
}
