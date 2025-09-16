import { useState, useEffect } from "react";
import Api from "./api";
import { Link } from "react-router-dom";
import { formatDistanceToNow} from 'date-fns'

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
      <h1 className="font-mono my-3">Comments:</h1>
      <ul>
        {comments.map((m) => (
            <li key={m.id}>
              <div className="bg-[#1c1e2a] rounded-2xl pt-3 pb-9 px-4 mb-5">
                <div className="flex mb-2 items-center">
                  <img
                    src={`http://localhost:8000${m.author.avatar}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex items-center">
                    <Link to={`/profile/${m.author.username}`} className="ml-2 font-semibold text-white">{m.author.username}</Link>
                    <p className="text-gray-400 text-[10px] ml-2 mt-1.5">{formatDistanceToNow(new Date(m.created_time),{addSuffix:true})}</p>
                  </div>
                  
                </div>
                <p className="mt-2 font-mono text-zinc-200">{m.body}</p>
              </div>
            </li>
        ))
        }
      </ul>

      <div className="mt-8">
        <textarea
          placeholder="Add a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-24 p-2 rounded border border-zinc-400 resize-none bg-[#1c1e2a] text-white 
                    hover:ring-2 hover:ring-blue-300 focus:ring-2 focus:ring-blue-300
                    focus:outline-none transition duration-300"
        />
        <button
          onClick={addComment}
          className="mt-2 border border-white rounded bg-blue-500 px-4 py-2 hover:bg-blue-800 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default CommentList;
