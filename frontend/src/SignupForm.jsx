// src/components/SignupForm.js
import React, { useState } from "react";
import Api from "./api";
import { useNavigate, Link } from "react-router-dom";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const signup = async () => {
    try {
      await Api.post("/register/", { username, password });
      const res = await Api.post("http://localhost:8000/token/", { username, password });
      console.log("Token:", res.data);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      //window.location.href = "/Profile";
      console.log("Navigating...");
      navigate("/profile");
    } catch (err) {
      setError("Signup failed. Username might already be taken.");
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-zinc-900 text-white px-4 py-6">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-sm hover:bg-zinc-700 transition">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="block w-full p-2 mb-3 rounded bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="block w-full p-2 mb-4 rounded bg-zinc-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={signup}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-400 hover:underline hover:text-blue-300"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;
