import { useState } from "react";
import Api from "./api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

function VoteButton({ postId, initialScore, user_vote}) {
  const [voted, setVoted] = useState(user_vote);  
  const [score, setScore] = useState(initialScore);

  const handleVote = async (value) => {
    if (voted === value) {
      try {
        await Api.post("/vote/", { post: postId, value });
        setVoted(0);
        setScore(score - value);
      } catch (error) {
        console.error(error);
      }
      return;
    }

    try {
      await Api.post("/vote/", { post: postId, value });
      setScore(score + value - (voted || 0)); 
      setVoted(value);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("You must Login First.");
      } else {
        alert("Something went wrong, try again.");
      }
    }
  };
  return (
    <div className="flex text-sm text-gray-400 bg-zinc-900 h-10 w-20 rounded-3xl justify-center items-center hover:bg-blue-300 duration-[0.40s]">
      <button
        onClick={() => handleVote(1)}
        className={`space-x-1 text-sm font-bold ${
          voted == 1
            ? "text-blue-300"
            : "text-gray-400 hover:text-green-500 cursor-pointer hover:scale-120"
        }`}
      >
        <FontAwesomeIcon icon={faArrowUp} className="mr-2 text-[20px]" />
      </button>

      <span className="text-[18px]">{score}</span>

      <button
        onClick={() => handleVote(-1)}
        className={`flex items-center text-sm font-bold ${
          voted == -1
            ? "text-blue-300"
            : "text-gray-400 hover:text-red-500 cursor-pointer hover:scale-120"
        }`}
      >
        <FontAwesomeIcon icon={faArrowDown} className="ml-2 text-[20px]" />
      </button>
    </div>
  );
}

export default VoteButton;
