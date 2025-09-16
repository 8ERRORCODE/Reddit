import { useState, useEffect } from "react";
import Api from "./api";
import CommunityBoard from "./CommunityBoard";
import PostItem from "./PostItem";
import CreatePost from "./CreatePost";


function Post() {
  const [posts, setPosts] = useState([]);

  const isAuthenticated = !!localStorage.getItem("access");

  useEffect(() => {
    Api.get("/posts/").then((res) => setPosts(res.data));
  }, []);
  return ( 
    <div className="min-h-screen text-white px-4 py-15">
      <div className="max-w-2xl mx-auto">
        <div className="">
          <ul className="space-y-4">
            {posts.map((p) => (
              <PostItem key={p.id} post={p}/>
            ))}
          </ul>

          {isAuthenticated && (
              <CreatePost communityid={(new_post)=>setPosts([...posts,new_post])}/>
          )}
        </div>
        <div className="absolute right-15 top-35">
          <CommunityBoard />
        </div>
      </div>
    </div>
  );
}

export default Post
