// src/components/LogoutButton.js
import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
    localStorage.removeItem('username');
  };

  return <button onClick={logout}>Logout</button>;
}

export default LogoutButton;
