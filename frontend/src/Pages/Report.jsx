import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Header from "../components/Molecules/Header";
import Navigation from "../components/Molecules/Navigation";
import axios from "axios";
import {
  useGetReportDataQuery,
  useGetReportDataByUserIdQuery,
} from "../features/users";

export const Report = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(0);
  const [role, setRole] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    responseToken();
  }, []);

  const responseToken = async () => {
    try {
      const response = await axios.get("http://localhost:2000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUserId(decoded.userId);
      setRole(decoded.role);
    } catch (error) {
      navigate("/login");
    }
  };

  const getReportDataQuery =
    role === "admin" || "operator"
      ? useGetReportDataQuery
      : useGetReportDataByUserIdQuery;
  const { data: reportData, isError } = getReportDataQuery(userId);

  if (isError) {
    navigate("/dashboard");
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex flex-1">
        {/* Navigation */}
        <Navigation />

        {/* Dashboard content */}
        <div className="flex-1 bg-white p-8">
          <div className="container p-4 mt-md-4 mt-2 border">
            <h2 className="text-2xl font-semibold mb-6">Report</h2>
            {reportData ? (
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Uploaded By</th>
                    <th>Status</th>
                    <th>Detail</th>
                    {/* Add more table headers as needed */}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((report) => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.name}</td>
                      <td>{report.size}</td>
                      <td>{report.uploadByUser.name}</td>
                      <td>{report.statusReport.name}</td>
                      <td>
                        <a
                          href={`/report/detail/${report.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <button className="btn btn-sm btn-outline">
                            Detail
                          </button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <center>
                <span className="loading loading-infinity loading-lg"></span>;
              </center>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
