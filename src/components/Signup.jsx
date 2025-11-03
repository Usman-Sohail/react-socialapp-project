import React, { useEffect, useState } from "react";
import "../signup.css";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FETCH_USERS_API } from "./api";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("usman");
  const [email, setEmail] = useState("usman@gmail.com");
  const [password, setPassword] = useState("Usman123");
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  useEffect(() => {
    if (users.length === 0) {
      fetch(FETCH_USERS_API)
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
          localStorage.setItem("users", JSON.stringify(data));
        })
        .catch((err) => console.error("Error fetching users:", err));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSignup() {
    if (!username || !email || !password) {
      toast.error("All fields are required.");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
    if (!usernameRegex.test(username)) {
      toast.error("Username must be 3-15 characters and alphanumeric only.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be 8+ chars, include 1 uppercase, 1 lowercase & 1 number."
      );
      return;
    }

    const userExists = users.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() ||
        user.username.toLowerCase() === username.toLowerCase()
    );

    if (userExists) {
      toast.error("Email or username already exists.");
      return;
    }

    const newUser = {
      id: uuidv4(),
      username,
      email,
      password,
    };

    const updatedUserList = [...users, newUser];
    setUsers(updatedUserList);
    localStorage.setItem("users", JSON.stringify(updatedUserList));

    toast.success("Sign-up Successful!");
    navigate("/signin");
  }

  return (
    <div className="container">
      <div className="signup-card">
        <h2>Sign-up</h2>

        <label>Name</label>
        <input
          type="text"
          placeholder="Enter name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <small className="hint">
          Must be 3-15 characters, only letters and numbers. Cannot be only
          numbers
        </small>

        <label>Email</label>
        <input
          type="email"
          placeholder="abc@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <small className="hint">
          At least 8 chars, include 1 uppercase, 1 lowercase, and 1 number.
        </small>

        <button onClick={handleSignup}>Sign-up</button>

        <p>
          Already have an account? <Link to="/signin">Sign-in</Link>
        </p>
      </div>
    </div>
  );
}
