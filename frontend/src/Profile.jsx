import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Api from "./api";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophoneAlt,faClock } from "@fortawesome/free-solid-svg-icons";


const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newName, setNewName] = useState("");
  const fileInputRef = useRef(null);

  const isCurrentUser = localStorage.getItem("username") == username;

  useEffect(() => {
    if (!username) return;

    Api.get(`/profile/${username}/`)
      .then((res) => {
        setProfile(res.data);
        setNewName(res.data.user.username);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setProfile(null);
      });
  }, [username]);

  useEffect(() => {
    Api.get("/posts/")
      .then((res) => {
        const userPosts = res.data.filter(
          (post) => post.author.username === username
        );
        setPosts(userPosts);
      })
      .catch((err) => console.error("Posts fetch error:", err));
  }, [username]);

  const saveName = () => {
    Api.put(`/profile/${username}/`, { username: newName })
      .then(() => {
        setProfile((prev) => ({
          ...prev,
          user: { ...prev.user, username: newName },
        }));
        setEditingName(false);
      })
      .catch((err) => console.error("Username update error:", err));
  };

  const handleImageClick = () => {
    if (isCurrentUser) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    Api.put(`/profile/${username}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setProfile((prev) => ({
          ...prev,
          avatar: res.data.avatar,
        }));
      })
      .catch((err) => console.error("Avatar update error:", err));
  };
  if (!profile) {
    return (
      <div className="flex min-h-screen bg-[#1c1e2a] text-white items-center justify-center">
        Loading profile...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#1c1e2a] text-white flex items-center justify-center px-4 py-6">
      <div className="flex flex-col bg-[#2a2e4a61] py-6 rounded-lg shadow w-full max-w-2xl items-center text-center">
        <div className="absolute right-20 top-35 bg-[#2a2e4a61] w-70 h-auto rounded-2xl p-4">
        {profile.avatar ? (
          <img
            src={`http://localhost:8000${profile.avatar}`}
            alt="avatar"
            onClick={handleImageClick}
            className="w-full h-30 rounded-2xl mt-4 border border-white object-cover"
          />
        ) : (
          <div
            onClick={handleImageClick}
            className="w-40 h-40 rounded-full bg-[#1c1e2a] flex items-center justify-center text-4xl mb-4 cursor-pointer hover:opacity-80"
          >
            {profile.user.username.charAt(0).toUpperCase()}
          </div>
        )}


        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />

        <p className="font-bold text-2xl mt-3">{username}</p>

        <div className="flex items-center mt-6 mb-3 text-gray-300 space-x-2">
          <FontAwesomeIcon icon={faMicrophoneAlt}/>
          <p >{profile.description || "No description yet."}</p>
        </div>
        <div className="flex items-center text-gray-300 mb-6 space-x-2">
          <FontAwesomeIcon icon={faClock}/>
          <p className="">
            {formatDistanceToNow(new Date(profile.date_joined),{addSuffix:true})}
          </p>
        </div>
      </div>

        <h2 className=" text-[30px] mb-2 font-semibold ">Posts:</h2>
        <ul className="space-y-2 w-full max-w-md">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
             
                <li key={post.id} className="bg-[#1c1e2a] p-4 rounded text-left mt-2">
                  <Link to={`/${post.id}`} className="">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(post.created_time),{addSuffix:true})}
                    </p>
                  </div>
                  {post.image && (
                      <img
                      src={post.image}
                      alt="Post_image"
                      className="rounded-lg mt-2 max-h-96 object-contain w-full mb-3"
                      />
                  )}
                  <p className="text-sm text-gray-300">{post.body}</p>
                </Link>
                </li>
            ))
          ) : (
            <p className="text-gray-400">No posts found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
