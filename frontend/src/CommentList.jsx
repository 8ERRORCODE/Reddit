import { useState, useEffect } from "react";
import Api from "./api";
import { Link } from "react-router-dom";

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!postId) return;
    Api.get(`posts/${postId}/comments/`)
      .then((res) => setComments(res.data))
      .catch((error) => {
        console.error("Error fetching comments:", error);
        alert("Failed to load comments.");
      });
  }, [postId]);

  const addComment = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("You must be logged in to comment.");
      return;
    }

    if (!body.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    Api.post(`posts/${postId}/comments/`, { body })
      .then((res) => {
        setComments([...comments, res.data]);
        setBody("");
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
        alert("Failed to post comment.");
      });
  };

  return (
    <div>
      <h1 className="font-mono mb-3">Comments:</h1>
      <ul>
        {comments.map((m) => (
          <li key={m.id}>
            <div className="bg-zinc-900 rounded-2xl pt-3 pb-9 px-4 mb-5">
              <div className="flex mb-2 items-center">
                <img
                  src={`http://localhost:8000${m.author.avatar}`}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <Link to={`/profile/${m.author.username}`} className="ml-2 font-semibold text-white">{m.author.username}</Link>
              </div>
              <p className="mt-2 font-mono text-zinc-200">{m.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <textarea
          placeholder="Add a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-24 p-2 rounded border border-zinc-600 resize-none bg-zinc-800 text-white 
                    hover:ring-2 hover:ring-green-500 focus:ring-2 focus:ring-green-500 
                    focus:outline-none transition duration-300"
        />
        <button
          onClick={addComment}
          className="mt-2 border border-white rounded bg-green-600 px-4 py-2 hover:bg-green-700 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default CommentList;
