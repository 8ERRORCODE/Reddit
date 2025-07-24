// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Community from "./Community";
import Post from "./Post";
import PostDetail from "./PostDetail";
import LoginForm from "./LoginForm";
import Nav from "./assets/Nav";
import SignupForm from "./SignupForm";
import Profile from "./Profile";
import Sidebar from "./Sidebar";


function App() {
  return (
   
    <Router >
      <Sidebar />
      <Nav />
      <div className="min-h-screen bg-[#1c1e2a] text-white pt-20">
      <Routes>
        <Route path="/community" element={<Community />} />
        <Route path="/" element={<Post />} />
        <Route path="/:id" element={<PostDetail />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<SignupForm />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
      </div>
    </Router>
    
  );
  
}

export default App;
