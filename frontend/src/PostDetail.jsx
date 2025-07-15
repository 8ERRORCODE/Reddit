import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "./api";
import VoteButton from "./VoteButton";
import CommentList from "./CommentList";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    Api.get(`posts/${id}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
      });
  }, [id]);

  if (!post) return <p className="text-white p-4">Loading...</p>;
  return (
    <div className="flex justify-center min-h-screen bg-zinc-900 text-white px-4 py-6">
      <div className="w-full max-w-2xl bg-zinc-800 p-6 rounded-lg shadow-lg hover:bg-zinc-700 transition">
        <div className="flex items-center space-x-2 mt-2 mb-4">
          {post.author.avatar ? (
            <img
              src={`http://localhost:8000${post.author.avatar}`}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
              {post.author.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Author: {post.author.username}</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6">{post.title}</h1>

        {post.image && (
          <img
            src={`http://127.0.0.1:8000${post.image}`}
            alt="Post"
            className="rounded-lg max-h-96 w-full object-contain mb-6"
          />
        )}
        <p className="text-gray-300 mb-8 mt-10">{post.body}</p>
        <VoteButton postId={post.id} initialScore={post.vote_score} />
        <CommentList postId={post.id}/>
      </div>
    </div>
  );
}

export default PostDetail;
