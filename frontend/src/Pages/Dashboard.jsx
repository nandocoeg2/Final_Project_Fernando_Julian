import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching...");
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

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
              Welcome to Dashboard!
            </h2>
            <button className="btn">Get</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
