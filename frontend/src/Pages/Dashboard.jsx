import React, { useState, useEffect } from "react";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  useGetReportDataQuery,
  useRefreshTokenMutation,
} from "../features/users";
import axios from "axios";
import { axiosInstance } from "../app/axios";

export const Dashboard = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [role, setRole] = useState("");
  const [reportDataLength, setReportDataLength] = useState(0);
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

  const { data: reportData } = useGetReportDataQuery();

  useEffect(() => {
    if (reportData) {
      setReportDataLength(
        reportData.filter((report) => report.statusReport.id === 1).length
      );
    }
  }, [reportData]);

  const getUsers = async () => {
    const response = await axiosInstance.get("http://localhost:2000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Konten Dashboard */}
      <div className="flex flex-1">
        {/* Navigasi */}
        <Navigation />

        {/* Konten Dashboard */}
        <div className="flex-1 bg-white p-8">
          <div className="container">
            <div className="flex gap-4 justify-between">
              <div className="card w-full bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="text-2xl font-semibold mb-6">
                    Welcome to Dashboard! {name} {expire} {role}
                  </h2>
                  {role === "operator" ? (
                    <div>
                      <p>You have {reportDataLength} report need action!</p>
                      <div className="card-actions justify-end">
                        <a
                          className="btn btn-primary"
                          href="
                        /approval"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  ) : role === "maker" ? (
                    <div>
                      <p>Check your report!</p>
                      <div className="card-actions justify-end">
                        <a
                          className="btn btn-outline"
                          href="
                        /approval"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p>You have no report need action.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
