import React, { useState, useEffect } from "react";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useRefreshTokenMutation } from "../features/users";
import axios from "axios";
import { axiosInstance } from "../app/axios";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    responseToken();
  }, []);

  const [refreshToken] = useRefreshTokenMutation();

  const responseToken = async () => {
    try {
      const response = await refreshToken();
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setExpire(decoded.exp);
      setRole(decoded.role);
      // console.log("ini hasil decode", decoded);
    } catch (error) {
      navigate("/login");
    }
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get("http://localhost:2000/token");
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwt_decode(response.data.accessToken);
        setName(decoded.name);
        setExpire(decoded.exp);
        setRole(decoded.role);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUsers = async () => {
    const response = await axiosInstance.get("http://localhost:2000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
  };

  const Logout = async () => {
    const response = await axios.delete("http://localhost:2000/logout");
    console.log(response.data);
    navigate("/login");
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
              Welcome to Dashboard! {name} {expire} {role}
            </h2>
            <button onClick={getUsers} className="btn">
              Get
            </button>
            <button onClick={Logout} className="btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
