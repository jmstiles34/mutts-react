import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import "../App.css";
import { useSession } from "../contexts";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  let [name, setName] = useState<string>("");
  let [email, setEmail] = useState<string>("");
  let [error, setError] = useState<string>("");
  let navigate = useNavigate();
  const { updateSession } = useSession();

  async function handleLogin(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
        credentials: "include",
      });

      if (response.ok) {
        updateSession({name, email});
        navigate({
          to: "/search",
        });
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="button">
          <i className="fa-solid fa-paw fa-xl"></i> &nbsp;Start Searching
        </button>
      </form>
    </div>
  );
}
