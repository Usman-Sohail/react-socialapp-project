import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../createPost.css";
export default function CreatePost({ posts, setPosts }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [post, setPost] = useState({
    id: uuidv4(),
    userId: currentUser?.id,
    title: "",
    body: "",
    authorizedUsers: [currentUser?.id],
  });

  function handleCreatePost() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      toast.error("You must be signed in to create a post!");
      return;
    }
    if (!post.title.trim() || !post.body.trim()) {
      toast.error("Please fill in both fields!");
      return;
    }

    const newPost = {
      userId: post.userId,
      id: uuidv4(),
      title: post.title,
      body: post.body,
      authorizedUsers: post.authorizedUsers,
    };

    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    setPost({ id: uuidv4(), userId: currentUser?.id, title: "", body: "" });
    toast.success("Post Added!");
  }
  return (
    <div className="new-post">
      <h5 className="current-user">
        {currentUser ? `Signed in as ${currentUser.username}` : "Not logged in"}
      </h5>

      <p>Create Post</p>

      <input
        type="text"
        placeholder="Title"
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
      />
      <textarea
        placeholder="Write your post here..."
        value={post.body}
        onChange={(e) => setPost({ ...post, body: e.target.value })}
      />

      <button className="btn-create-post" onClick={handleCreatePost}>
        Create Post
      </button>
    </div>
  );
}
