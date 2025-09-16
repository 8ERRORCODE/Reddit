import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/Logo2.png"; 
import Api from "../api";
import Profile from "../Profile";
import Search from "../Search";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [avatar,setAvatar] = useState(null)
  const isAuthenticated = !!localStorage.getItem("access");
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };
  const username = localStorage.getItem('username')

  useEffect(()=>{
      if(!username) {
        setAvatar("")
      };
      Api.get(`/profile/${username}/`)
      .then((res) =>{
        setAvatar(res.data.avatar);
      })
      .catch((err) =>{
        console.log('avatar fetch failed',err)
        setAvatar(null)
      })
  },[isAuthenticated]);
  return (
    <nav
    className="flex justify-between items-center px-4 py-4 border-b-2 border-blue-300 fixed top-0 left-0 w-full z-50"
    style={{
      backgroundColor: 'rgba(42, 10, 70, 0.6)',
      backdropFilter: 'blur(70px)',
    }}
  >
      
      <Link to="/" className="flex items-center space-x-3">
        <img src={Logo} alt="Logo" className="rounded-full h-16 w-auto" />
        <p className="font-mono text-white text-2xl">ChitChat</p>
      </Link>
      <Search/>
      <div className="flex items-center space-x-4 text-white mr-20">
        {isAuthenticated ? (
          <>
            <button onClick={logout} className="bg-white text-black px-3 py-1 rounded">
              Logout
            </button>
            {avatar && (
              <Link to={`/profile/${username}`}>
                <div className="flex items-center space-x-4 text-white">
                {avatar ? (
                  <img
                    src={`http://localhost:8000${avatar}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full object-cover border-2 border-white">
                    {username.charAt(0).toUpperCase()}
                  </div>)}
                </div>
              </Link>

            )}
          </>
        ) : (!isLoginPage && !isRegisterPage) ? (
          <Link to="/login" className="bg-white text-black px-3 py-1 rounded">
            Login
          </Link>
        ) : null}
      </div>
    </nav>

  );
}

export default Nav;
