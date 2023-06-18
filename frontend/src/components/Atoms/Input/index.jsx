// Input.jsx
import React from "react";

const Input = ({ type, placeholder, value, onChange }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-indigo-300"
    />
  );
};

export default Input;
