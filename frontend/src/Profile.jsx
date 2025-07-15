import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Api from "./api";

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
      <div className="flex min-h-screen bg-zinc-900 text-white items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center px-4 py-6">
      <div className="flex flex-col bg-zinc-800 p-8 rounded-lg shadow w-full max-w-2xl items-center text-center">
        

        {profile.avatar ? (
          <img
            src={`http://localhost:8000${profile.avatar}`}
            alt="avatar"
            onClick={handleImageClick}
            className="w-40 h-40 rounded-full object-cover mb-5 mt-4"
          />
        ) : (
          <div
            onClick={handleImageClick}
            className="w-40 h-40 rounded-full bg-gray-600 flex items-center justify-center text-4xl mb-4 cursor-pointer hover:opacity-80"
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

        <p className="mb-6 mt-10 text-gray-300 rounded w-full py-6">{profile.description || "No description yet."}</p>


        <h2 className=" text-xl mt-6 mb-2 font-semibold ">Posts:</h2>
        <ul className="space-y-2 w-full max-w-md">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <li key={post.id} className="bg-zinc-700 p-4 rounded text-left">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-300">{post.body}</p>
                <p className="text-xs text-gray-400">
                  {new Date(post.created_time).toLocaleString()}
                </p>
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
