import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserActions({ post, posts, setPosts, handleEdit }) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  function handleAuthorizeButton(selectedPost, userId) {
    const updatedPosts = posts.map((p) => {
      if (p.id === selectedPost.id) {
        const alreadyAuthorized = p.authorizedUsers?.includes(userId);

        return {
          ...p,
          authorizedUsers: alreadyAuthorized
            ? p.authorizedUsers.filter((id) => id !== userId)
            : [...(p.authorizedUsers || []), userId],
        };
      }
      return p;
    });

    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  }
  function handleDelete(id) {
    const updatedPosts = posts.filter((p) => p.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    localStorage.removeItem(`comments-${id}`);

    toast.info("Post deleted!");
  }

  return (
    <>
      <button onClick={() => handleDelete(post.id)} className="btn-delete">
        Delete Post
      </button>
      <button onClick={() => handleEdit(post)} className="btn-edit">
        Edit Post
      </button>
      <div>
        <select
          onChange={(e) => handleAuthorizeButton(post, e.target.value)}
          value=""
        >
          <option value="" disabled>
            Select user to authorize
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
              {post.authorizedUsers?.includes(String(user.id)) ? " ✅" : " ❌"}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
