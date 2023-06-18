// LoginForm.jsx
import React, { useState } from "react";
import Label from "../../Atoms/Label";
import Input from "../../Atoms/Input";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform validation
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    // Call the onLogin function with email and password
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex justify-center">
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
