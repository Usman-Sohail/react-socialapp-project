import React, { useEffect, useState } from "react";
import "../signup.css";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("usman");
  const [email, setEmail] = useState("usman@gmail.com");
  const [password, setPassword] = useState("usman");
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  useEffect(() => {
    if (users.length === 0) {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
          localStorage.setItem("users", JSON.stringify(data));
        })
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, []);

  function handleSignup() {

    if (!username || !email || !password) {
      toast.error("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email.");

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

    alert("Sign-up Successful!");
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

        <button onClick={handleSignup}>Sign-up</button>

        <p>
          Already have an account? <Link to="/signin">Sign-in</Link>
        </p>
      </div>
    </div>
  );
}
