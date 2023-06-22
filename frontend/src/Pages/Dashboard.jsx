import React, { useState, useEffect } from "react";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useRefreshTokenMutation } from "../features/users";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await fetch("http://localhost:2000/token", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setToken(data.accessToken);
      const decoded = jwt_decode(data.accessToken);
      setName(decoded.name);
      setExpiresIn(decoded.exp);
      console.log(decoded);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  const getUsers = async () => {
    const response = await fetch("http://localhost:2000/users", {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching...");
  };
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header handleSearch={handleSearch} />

      {/* Konten Dashboard */}
      <div className="flex flex-1">
        {/* Navigasi */}
        <Navigation />

        {/* Konten Dashboard */}
        <div className="flex-1 bg-white p-8">
          <div className="container">
            <h2 className="text-2xl font-semibold mb-6">
              Welcome to Dashboard! {name}
            </h2>
            <button onClick={getUsers} className="btn">
              Get
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
