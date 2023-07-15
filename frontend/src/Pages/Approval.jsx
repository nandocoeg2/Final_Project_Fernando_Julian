import React, { useEffect, useState } from "react";
import Header from "../components/Molecules/Header";
import Navigation from "../components/Molecules/Navigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {
  useGetReportDataByUserIdQuery,
  useGetReportDataQuery,
  useRefreshTokenMutation,
} from "../features/users";
import { axiosInstance } from "../app/axios";

export const Approval = () => {
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(0);
  const [name, setName] = useState("");
  const [expire, setExpire] = useState("");
  const [role, setRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // Set the number of items per page

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

  const { data: reportData, isError } = useGetReportDataQuery(userId);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reportData
    ? reportData
        .filter((report) => report.statusReport.id === 1)
        .slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = reportData
    ? Math.ceil(
        reportData.filter((report) => report.statusReport.id === 1).length /
          itemsPerPage
      )
    : 0;

  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;
    const buttons = [];

    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`join-item btn ${currentPage === i ? "btn-active" : ""}`}
          onClick={() => paginate(i)}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
            <h2 className="text-2xl font-semibold mb-6">Approval</h2>
            {reportData ? (
              <>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Length</th>
                      <th>Uploaded by</th>
                      <th>Uploaded time</th>
                      <th>Status</th>
                      <th>Detail</th>
                      {/* Add more table headers as needed */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <center>
                          <td>No data available.</td>
                        </center>
                      </tr>
                    ) : (
                      currentItems
                        .filter((report) => report.statusReport.id === 1)
                        .map((report, index) => (
                          <tr key={report.id}>
                            <td>{index + 1}</td>
                            <td>{report.name}</td>
                            <td>{report.length}</td>
                            <td>{report.uploadByUser.name}</td>
                            <td>
                              {new Date(report.createdAt).toLocaleString()}
                            </td>
                            <td>
                              <span className="badge badge-warning">
                                {report.statusReport.name}
                              </span>
                            </td>
                            <td>
                              <a
                                href={`/approval/detail/${report.id}`}
                                rel="noreferrer"
                              >
                                <button className="btn btn-sm btn-outline">
                                  Detail
                                </button>
                              </a>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
                <center>
                  <div className="join">{renderPaginationButtons()}</div>
                </center>
              </>
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
