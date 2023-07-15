import React from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/users";
import { useFormik } from "formik";

export const LoginPage = () => {
  const navigate = useNavigate();

  const [login, { isLoading, error, data }] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const result = await login(values);
      if (result?.data) {
        isLoading
          ? console.log("Logging in...")
          : setTimeout(() => navigate("/dashboard"), 1000);
      }
    },
  });

  return (
    <div className="grid grid-cols-2 items-center min-h-screen bg-white">
      <div className="max-w-xl ml-16">
        <img
          src="https://static.vecteezy.com/system/resources/previews/004/689/193/large_2x/man-entering-security-password-free-vector.jpg"
          alt="login"
        />
      </div>
      <div className="max-w-md w-full bg-white p-8">
        <h1 className="text-3xl font-bold mb-6">Login</h1>
        {data && <p>Login successful!</p>}
        {error && <p>{error.data.error}</p>}
        <form onSubmit={formik.handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded mb-4"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
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
