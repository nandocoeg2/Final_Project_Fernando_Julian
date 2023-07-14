import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRefreshTokenMutation } from "../../../features/users";
import jwt_decode from "jwt-decode";

const Header = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");

  const navigate = useNavigate();
  const Logout = async () => {
    const response = await axios.delete("http://localhost:2000/logout");
    console.log(response.data);
    navigate("/login");
  };

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
    } catch (error) {
      navigate("/login");
    }
  };
  return (
    <>
      <header className="bg-gray-200 py-4 px-6">
        <div className="flex justify-between items-center mx-4">
          <div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BANK_BRI_logo.svg/1280px-BANK_BRI_logo.svg.png"
              alt=""
              className="w-28"
            />
          </div>
          <div className="flex gap-4 items-center">
            <h3>Hi, {name}</h3>
            <button onClick={Logout} className="btn">
              Logout
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
