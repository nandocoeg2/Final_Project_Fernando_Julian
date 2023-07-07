import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Header from "../components/Molecules/Header";
import Navigation from "../components/Molecules/Navigation";
import axios from "axios";

export const Report = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(0);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    responseToken();
  }, []);

  useEffect(() => {
    getReport();
  }, [userId]);

  const responseToken = async () => {
    try {
      const response = await axios.get("http://localhost:2000/token");
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setUserId(decoded.userId);
    } catch (error) {
      navigate("/login");
    }
  };

  const getReport = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2000/report/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReport(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

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
            {loading ? (
              // Loading spinner
              <center>
                <span className="loading loading-infinity loading-lg"></span>
              </center>
            ) : (
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
                  {report.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.size}</td>
                      <td>{item.uploadByUser.name}</td>
                      <td>{item.statusReport.name}</td>
                      <td>
                        <a
                          href={`/report/detail/${item.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          Detail
                        </a>
                      </td>
                      {/* Add more table cells as needed */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
