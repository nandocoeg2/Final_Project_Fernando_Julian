import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/users";

export const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [login, { isLoading, error, data }] = useLoginMutation();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(credentials);
    if (result?.data) {
      isLoading
        ? console.log("Logging in...")
        : setTimeout(() => navigate("/dashboard"), 1000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        {data && <p>Login successful!</p>}
        {error && <p>{error.data.error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};