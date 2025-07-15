import { useState } from "react";
import Api from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

function VoteButton({ postId, initialScore}) {
  const [voted, setVoted] = useState(false);
  const [score, setScore] = useState(initialScore);
  const [error,setError] = useState("")

  const handleVote = async () => {
    if (voted) return;

    try {
      await Api.post("/vote/", { post: postId, value: 1 });
      setVoted(true);
      setScore(score + 1);
      setError("")
    } catch (error) {
      if (error.response?.status === 401) {
        alert("You must Login First.");
      } else if (error.response?.status === 400 || error.response?.status === 409) {
        alert("You've already voted on this post.");
      } else {
        alert("Something went wrong,Try again.");
      }
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="flex text-sm text-gray-400 mb-4 bg-zinc-900 h-10 w-15 p-1 rounded justify-center ">
    <button
      onClick={handleVote}
      className={`flex items-center space-x-1 text-sm font-bold ${
        voted ? "text-orange-500" : "text-green-300 hover:text-green-500 cursor-pointer hover:scale-80"
      }`}
      aria-label="Vote"
    >
      <FontAwesomeIcon icon={faThumbsUp} className="mr-2 text-[20px]" />
      <span>{score}</span>
    </button>
  </div>
  );
}

export default VoteButton;
