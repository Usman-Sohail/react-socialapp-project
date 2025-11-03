import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../comments.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FETCH_COMMENTS_API } from "./api";

export default function Comments({ postObj }) {
  const [error, setError] = useState(null);

  if (error) throw error;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [comments, setComments] = useState(
    JSON.parse(localStorage.getItem(`comments-${postObj.id}`)) || []
  );

  const [toggleComments, setToggleComments] = useState(false);
  const [commentState, setCommentState] = useState({
    postId: postObj?.id,
    id: uuidv4(),
    name: currentUser?.username,
    email: currentUser?.email,
    body: "",
  });
  const [editData, setEditData] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const storedComments = JSON.parse(
      localStorage.getItem(`comments-${postObj.id}`)
    );
    if (storedComments) {
      setComments(storedComments);
    } else {
      fetch(FETCH_COMMENTS_API(postObj.id))
        .then((res) => res.json())
        .then((data) => {
          setComments(data);
          localStorage.setItem(`comments-${postObj.id}`, JSON.stringify(data));
        })
        .catch((err) => console.error("Error fetching comments:", err));
    }
  }, [postObj.id]);

  function handleComments() {
    setToggleComments((prev) => !prev);
  }
  function userLoggedIn() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser ? true : false;
  }
  if (userLoggedIn() === false) {
    throw new Error("User not logged in or Session expired. Reloading...");
  }
  function doesCommentExist(postId, commentId) {
    const storedComments =
      JSON.parse(localStorage.getItem(`comments-${postId}`)) || [];
    return storedComments.some((comment) => comment.id === commentId);
  }

  function handleAddComment(commentState) {
    const storedComments =
      JSON.parse(localStorage.getItem(`comments-${commentState.postId}`)) || [];
    if (storedComments.length < 0) {
      setComments([]);
    }

    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    const postExists = posts.some((post) => post.id === commentState.postId);

    if (!postExists) {
      localStorage.removeItem(`comments-${postObj.id}`);

      setError(
        new Error("Cannot add comment. Post expired or removed. Reloading...")
      );
      return;
    }

    const newComment = {
      postId: commentState.postId,
      id: uuidv4(),
      name: commentState.name,
      email: commentState.email,
      body: commentState.body,
    };

    if (newComment.body.trim() === "") {
      toast.warning("Comment cannot be empty!");
      return;
    }
    const updatedComments = [...storedComments, newComment];

    setComments(updatedComments);
    localStorage.setItem(
      `comments-${postObj.id}`,
      JSON.stringify(updatedComments)
    );
    setCommentState({ ...commentState, body: "" });

    toast.success("Comment added successfully!");
  }

  function handleDelete(id) {
    if (!doesCommentExist(postObj.id, id)) {
      toast.error("Comment not found or deleted. Reoading...");
      setTimeout(() => window.location.reload(), 3000);
      return;
    }

    const updatedComments = comments.filter((c) => c.id !== id);
    setComments(updatedComments);
    localStorage.setItem(
      `comments-${postObj.id}`,
      JSON.stringify(updatedComments)
    );
    toast.info("Comment deleted!");
  }

  function handleEdit(comment) {
    if (!doesCommentExist(postObj.id, comment.id)) {
      setTimeout(() => window.location.reload(), 3000);
      toast.error("Comment not found or deleted. Reloading...");
    }
    setEditId(comment.id);
    setEditData(comment.body);
  }
  function handleSave(commentId) {
    if (!doesCommentExist(postObj.id, commentId)) {
      toast.error("Comment not found or deleted.");

      return;
    }
    if (!editData.trim()) {
      toast.error("Comment cannot be empty!");
      return;
    }

    const originalComment = comments.find((c) => c.id === commentId);
    if (originalComment && originalComment.body === editData.trim()) {
      toast.info("No changes made to the comment.");
      return;
    }

    const updatedComments = comments.map((c) =>
      c.id === commentId ? { ...c, body: editData.trim() } : c
    );

    setComments(updatedComments);
    localStorage.setItem(
      `comments-${postObj.id}`,
      JSON.stringify(updatedComments)
    );

    setEditId(null);
    toast.success("Comment updated successfully!");
  }

  function checkAuthorized(post) {
    return post.authorizedUsers?.includes(String(currentUser?.id));
  }

  return (
    <div className="comments">
      <h4>Comments</h4>

      <input
        className="comment-input"
        placeholder="Your thoughts..."
        value={commentState.body}
        onChange={(e) =>
          setCommentState({ ...commentState, body: e.target.value })
        }
        disabled={!checkAuthorized(postObj)}
      />

      <button
        className="btn-add-comment"
        onClick={() => handleAddComment(commentState)}
        hidden={!checkAuthorized(postObj)}
      >
        send
      </button>

      <button onClick={handleComments} className="btn-comment">
        {toggleComments ? "Hide Comments" : "Show Comments"}
      </button>

      {toggleComments && (
        <>
          {comments.length > 0 ? (
            [...comments].reverse().map((comment) => (
              <div className="comment" key={comment.id}>
                {editId === comment.id ? (
                  <div className="edit-post">
                    <textarea
                      value={editData}
                      onChange={(e) => setEditData(e.target.value)}
                    />
                    <button
                      onClick={() => handleSave(comment.id)}
                      className="btn-save"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="btn-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="comment-body">{comment.body}</p>
                    <p className="comment-user">
                      posted by:
                      {comment.name === currentUser.username
                        ? "You"
                        : comment.name}
                    </p>
                    {currentUser.username === comment.name && (
                      <>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleEdit(comment)}
                          className="btn-edit"
                          disabled={!checkAuthorized(postObj)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <h5>No Comments to show</h5>
          )}
        </>
      )}
    </div>
  );
}
