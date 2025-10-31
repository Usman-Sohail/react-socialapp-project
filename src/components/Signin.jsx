import React, { useState } from "react";
import "../signup.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signin() {
  const [email, setEmail] = useState("usman@gmail.com");
  const [password, setPassword] = useState("usman");
  const navigate = useNavigate();

  function handleSignin() {
    const savedUsers = JSON.parse(localStorage.getItem("users"));
    const userFound = savedUsers?.find((user) => {
      return user.email === email && user.password === password;
    });

    if (userFound) {
      toast.success("Sign-in Success!");
      localStorage.setItem("currentUser", JSON.stringify(userFound));
      navigate("/posts");
    } else {
      toast.error("Signin Failed");
    }
  }
  return (
    <div className="container">
      <div className="signup-card">
        <h2>Sign-in</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignin();
          }}
        >
          <label>Email</label>
          <input
            type="email"
            placeholder="abc@gmail.com"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Sign-in</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign-up</Link>
        </p>
      </div>
    </div>
  );
}
