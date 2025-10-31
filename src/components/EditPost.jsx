import { useState } from "react";

export default function EditPost({ post, handleSave, setEditId }) {
  const [editData, setEditData] = useState({
    title: post.title,
    body: post.body,
  });

  return (
    <div className="edit-post">
      <input
        type="text"
        value={editData.title}
        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
      />
      <textarea
        value={editData.body}
        onChange={(e) => setEditData({ ...editData, body: e.target.value })}
      />
      <button onClick={() => handleSave(post.id,editData)} className="btn-save">
        Save
      </button>
      <button onClick={() => setEditId(null)} className="btn-cancel">
        Cancel
      </button>
    </div>
  );
}
