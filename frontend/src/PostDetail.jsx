import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Api from "./api";
import VoteButton from "./VoteButton";
import CommentList from "./CommentList";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

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
    <div className="flex justify-center min-h-screen bg-[#1c1e2a] text-white px-4 py-15">
      <div className="w-full max-w-2xl bg-[#2a2e4a61] p-6 rounded-lg shadow-lg hover:bg-[#2a2e4ad0] transition">
        <div className="flex items-center space-x-2 mt-2 mb-4">
          {post.author.avatar ? (
            <img
              src={`http://localhost:8000${post.author.avatar}`}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1c1e2a] flex items-center justify-center text-xs">
              {post.author.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex items-center">
            <Link to={`/profile/${post.author.username}`} className="text-gray-400 text-sm">{post.author.username}</Link>
            <p className="text-gray-400 text-[10px] ml-2 mt-1.5">{formatDistanceToNow(new Date(post.created_time),{addSuffix: true})}</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-6">{post.title}</h1>

        {post.image && (
          <img
            src={`${post.image}`}
            alt="Post"
            className="rounded-lg max-h-96 w-full object-contain mb-6"
          />
        )}
        <p className="text-gray-100 mb-8 mt-10">{post.body}</p>
        <VoteButton postId={post.id} initialScore={post.vote_score} user_vote={post.user_vote}/>
        <CommentList postId={post.id}/>
      </div>
    </div>
  );
}

export default PostDetail;
