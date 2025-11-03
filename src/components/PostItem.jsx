import EditPost from "./EditPost";
import UserActions from "./UserActions";
import Comments from "./Comments";
import { ErrorBoundary } from "./ErrorBoundary";

function PostItem({
  post,
  currentUser,
  users,
  handleEdit,
  handleSave,
  setPosts,
  posts,
  editId,
  setEditId,
}) {
  return (
    <div className="post">
      {editId === post.id ? (
        <EditPost post={post} handleSave={handleSave} setEditId={setEditId} />
      ) : (
        <>
          <p className="post-title">{post.title}</p>
          <p className="post-body">{post.body}</p>
          <p className="post-userId">
            posted by:{" "}
            {currentUser?.id === post.userId
              ? "You"
              : users.find((u) => u.id === post.userId)?.username || "Deleted User"}
          </p>

          {currentUser?.id === post.userId && (
            <UserActions
              post={post}
              posts={posts}
              setPosts={setPosts}
              handleEdit={handleEdit}
            />
          )}
          <ErrorBoundary>
            <Comments postObj={post} />
          </ErrorBoundary>
        </>
      )}
    </div>
  );
}

export default PostItem;
