import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const Logout = async () => {
    const response = await axios.delete("http://localhost:2000/logout");
    console.log(response.data);
    navigate("/login");
  };
  return (
    <>
      <header className="bg-gray-200 py-4 px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <button onClick={Logout} className="btn">
            Logout
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
