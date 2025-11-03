import { useEffect, useState, useMemo } from "react";
import "../posts.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import CreatePost from "./CreatePost";
import { FETCH_POSTS_API } from "./api";
import PostItem from "./PostItem";
import { toast } from "react-toastify";

export default function Posts() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const [posts, setPosts] = useState(
    JSON.parse(localStorage.getItem("posts")) || []
  );
  const [editId, setEditId] = useState(null);
  const reversedPosts = useMemo(() => [...posts].reverse(), [posts]);
  function userLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    return currentUser ? true : false;
  }
  useEffect(() => {
    if (posts.length === 0) {
      fetch(FETCH_POSTS_API)
        .then((res) => res.json())
        .then((data) => {
          setPosts(data);
          localStorage.setItem("posts", JSON.stringify(data));
        })
        .catch((err) => console.error("Error fetching posts:", err));
    }
  });

  function handleEdit(post) {
    if (userLoggedIn()) {
      setEditId(post.id);
    } else {
      toast.warning("Kindly Sign-in to edit posts. Session Expired");
    }
  }

  function handleSave(id, editData) {
    if (!userLoggedIn()) {
      toast.warning("Kindly Sign-in to save posts. Session Expired");
      return;
    }

    if (!editData.title.trim() || !editData.body.trim()) {
      toast.error("Title or body cannot be empty!");
      return;
    }

    const updatedPosts = posts.map((p) =>
      p.id === id ? { ...p, title: editData.title, body: editData.body } : p
    );

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setEditId(null);
    toast.success("Post updated successfully!");
  }

  function handleLogout() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      toast.info(
        "No user is currently signed in. Redirecting to Sign-in page."
      );
      navigate("/signin");
      return;
    }

    localStorage.removeItem("currentUser");
    window.location.reload();
  }
  if (!currentUser) {
    return (
      <>
        <h3>Kindly Sign-in to see posts</h3>
        <Link to="/signin">Sign-in</Link>
      </>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
        <CreatePost posts={posts} setPosts={setPosts} />
        <h2>No Posts To Show</h2>
      </>
    );
  }

  return (
    <>
      <button className="btn-logout" onClick={handleLogout}>
        Logout
      </button>
      <CreatePost posts={posts} setPosts={setPosts} />

      <div className="posts-container">
        {reversedPosts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            posts={posts}
            setPosts={setPosts}
            currentUser={currentUser}
            users={users}
            handleEdit={handleEdit}
            handleSave={handleSave}
            editId={editId}
            setEditId={setEditId}
          />
        ))}
      </div>
    </>
  );
}
