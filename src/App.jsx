import "./App.css";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Posts from "./components/Posts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/posts" />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </BrowserRouter>
  );
}

export default App;
