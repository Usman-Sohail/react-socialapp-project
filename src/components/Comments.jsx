import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "../comments.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FETCH_COMMENTS_API } from "./api";

export default function Comments({ postObj }) {
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
  function handleAddComment(commentState) {
    const newComment = {
      postId: commentState.postId,
      id: uuidv4(),
      name: commentState.name,
      email: commentState.email,
      body: commentState.body,
    };
    if (newComment.body.trim() === "") return;

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(
      `comments-${postObj.id}`,
      JSON.stringify(updatedComments)
    );
    setCommentState({
      ...commentState,
      body: "",
    });
  }

  function handleDelete(id) {
    const updatedComments = comments.filter((c) => c.id !== id);
    setComments(updatedComments);
    localStorage.setItem(
      `comments-${postObj.id}`,
      JSON.stringify(updatedComments)
    );
    toast.info("Comment deleted!");
  }

  function handleEdit(comment) {
    setEditId(comment.id);
    setEditData(comment.body);
  }
  function handleSave(commentId) {
    const updatedComments = comments.map((c) =>
      c.id === commentId ? { ...c, body: editData } : c
    );

    setComments(updatedComments);
    localStorage.setItem(
      `comments-${postObj.id}`,
      JSON.stringify(updatedComments)
    );

    setEditId(null);
  }
  function checkAuthorized(post) {
    return post.authorizedUsers?.includes(String(currentUser.id));
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
