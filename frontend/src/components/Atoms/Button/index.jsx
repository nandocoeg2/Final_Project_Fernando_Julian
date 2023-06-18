import React from "react";

const Button = ({ children, onClick }) => {
  return (
    <button
      className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-lg focus:outline-none"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
