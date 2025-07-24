import { useState, useEffect } from "react";
import Api from "./api";
import VoteButton from "./VoteButton";
import { Link } from "react-router-dom";
function Post() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", body: "", community: 1 });
  const [image, setImage] = useState(null);

  const isAuthenticated = !!localStorage.getItem("access");

  useEffect(() => {
    Api.get("/posts/").then((res) => setPosts(res.data));
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const createPost = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("body", form.body);
    formData.append("community", form.community);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await Api.post("/posts/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPosts([...posts, res.data]);
      setForm({ title: "", body: "", community: 1 });
      setImage(null);
    } catch (err) {
      alert("Post creation failed");
    }
  };
  return (
    
    <div className="min-h-screen text-white px-4 py-15">
      <div className="max-w-2xl mx-auto">
        <ul className="space-y-4">
          {posts.map((p) => (
            <li
              key={p.id}
              className="bg-zinc-800 p-4 rounded-lg shadow hover:bg-zinc-700 transition duration-[0.25s]"
            >
              <div className="flex items-center space-x-2 mt-2 mb-2">
                {p.author.avatar ? (
                  <img
                    src={`http://localhost:8000${p.author.avatar}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                    {p.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <Link to={`/profile/${p.author.username}`} className="text-gray-400 text-sm">{p.author.username}</Link>
              </div>
              <a href={`/${p.id}`} className="">
                <h2 className="text-xl font-semibold mb-4 mt-3">{p.title}</h2>
                {p.image && (
                  <img
                    src={p.image}
                    alt="Post"
                    className="rounded-lg mt-2 max-h-96 object-contain w-full mb-3"
                  />
                )}
                <p className="text-sm text-gray-300 mb-6 mt-4">
                  {p.body}
                </p>
              </a>
                <VoteButton postId={p.id} initialScore={p.vote_score} />

            </li>
          ))}
        </ul>

        {isAuthenticated && (
          <div className="mt-10 bg-zinc-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <input
              placeholder="Post Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-zinc-700 p-2 rounded mb-3 text-white placeholder-gray-400"
            />
            <textarea
              placeholder="Post Body"
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full bg-zinc-700 p-2 rounded mb-3 text-white placeholder-gray-400"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block mb-4 text-sm"
            />
            <button
              onClick={createPost}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
            >
              Submit
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default Post
