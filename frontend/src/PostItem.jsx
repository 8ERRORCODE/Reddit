import { formatDistanceToNow } from "date-fns";
import { faCommentAlt,faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VoteButton from "./VoteButton";
import { Link } from "react-router-dom";


function PostItem({post}){

    return(
        <li
            key={post.id}
            className="bg-[#2a2e4a61] p-4 rounded-lg shadow hover:bg-[#2a2e4ad0] transition duration-[0.25s]"
            >
            <Link to={`/${post.id}`}>
                <div className="flex items-center space-x-2 mt-2 mb-2">
                {post.author.avatar ? (
                    <img
                    src={`http://localhost:8000${post.author.avatar}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">/
                    <p>{post.author.username.charAt(0).toUpperCase()}</p>
                    
                    
                    </div>
                )}
                <div className="flex items-center">
                    <Link to={`/profile/${post.author.username}`} className="text-gray-400 text-sm">{post.author.username}</Link>
                    <p className="text-gray-400 text-[10px] ml-2 mt-1.5">{formatDistanceToNow(new Date(post.created_time),{addSuffix: true})}</p>
                </div>

                </div>
                <span className="">
                <h2 className="text-xl font-semibold mb-4 mt-3">{post.title}</h2>
                {post.image && (
                    <img
                    src={post.image}
                    alt="Post_image"
                    className="rounded-lg mt-2 max-h-96 object-contain w-full mb-3"
                    />
                )}
                <span className="text-sm text-gray-300 mb-6 mt-4">
                    {post.body}
                </span>
                </span>
            </Link>
                <div className="flex items-center mt-5 space-x-4 ">
                <VoteButton postId={post.id} initialScore={post.vote_score} user_vote={post.user_vote}/>
                <div className="flex items-center justify-center text-sm text-gray-400 space-x-1 rounded-full bg-zinc-900 h-10 w-20 hover:bg-blue-300 duration-[0.40s]"> 
                    <FontAwesomeIcon icon={faCommentAlt} />
                    <p>{post.comment_counter}</p>
                </div>
                    <button
                    onClick={() => {
                        if (navigator.share) {
                        navigator
                            .share({
                            title: "Check this post!",
                            text: "I found this post interesting:",
                            url: window.location.origin + `/${post.id}`,
                            })
                            .then(() => console.log("Shared successfully!"))
                            .catch((error) => console.error("Error sharing:", error));
                        } else {
                        alert("Your browser does not support share.");
                        }
                    }}
                    className="flex items-center justify-center text-sm text-gray-400 space-x-1 rounded-full bg-zinc-900 h-10 w-20 cursor-pointer hover:bg-blue-300 duration-[0.40s]"
                    >
                    <p className="pb-1">Share</p>
                    <FontAwesomeIcon icon={faShareFromSquare}/>
                    </button>
                </div>
        </li>
    )
}
export default PostItem