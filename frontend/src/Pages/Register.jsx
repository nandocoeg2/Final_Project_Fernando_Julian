import React, { useState } from "react";
import { useRegisterMutation } from "../features/users";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [register, { isLoading, error, data }] = useRegisterMutation();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(userData);
    if (!error) {
      isLoading
        ? console.log("Registering...")
        : setTimeout(() => navigate("/login"), 1000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6">Register</h1>
        {data && <p>Registration successful!</p>}
        {error && <p>{error.data.error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={userData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};