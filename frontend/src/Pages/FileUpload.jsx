import React, { useEffect, useState } from "react";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import {
  useRefreshTokenMutation,
  useAddReportDataMutation,
} from "../features/users";
import axios from "axios";
import { axiosInstance } from "../app/axios";
import jwt_decode from "jwt-decode";

export const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const isUploadDisabled = !selectedFile;
  const [CSVData, setCSVData] = useState();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [fileError, setFileError] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "text/csv") {
      setFileError("Invalid file format. Please select a CSV file.");
      setSelectedFile(null);
    } else {
      setFileError("");
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      Papa.parse(selectedFile, {
        skipEmptyLines: true,
        header: false,
        complete: (results) => {
          setCSVData(results.data);
          const reportData = {
            name: selectedFile.name,
            size: selectedFile.size,
            userId: userId,
            data: results.data.slice(1),
          };
          console.log(reportData);
          const addReport = async () => {
            try {
              await addReportData(reportData);
              setTimeout(() => {
                navigate("/report");
              }, 1000);
            } catch (error) {
              console.log(error);
            }
          };
          addReport();
        },
        error: (error) => {
          console.log("Error parsing CSV:", error);
        },
      });
    }
  };

  useEffect(() => {
    responseToken();
  }, []);

  const [refreshToken] = useRefreshTokenMutation();
  const [addReportData] = useAddReportDataMutation();

  const responseToken = async () => {
    try {
      const response = await refreshToken();
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
      setName(decoded.name);
      setUserId(decoded.userId);
      setExpire(decoded.exp);
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
        setUserId(decoded.userId);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
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
          <div className="container p-4 mt-md-4 mt-2 border">
            <h2 className="text-lg font-semibold">Upload File</h2>
            <form onSubmit={handleSubmit}>
              <div className="text-center">
                {selectedFile && (
                  <span className="text-gray-500">{selectedFile.name}</span>
                )}
                {fileError && <span className="text-red-500">{fileError}</span>}
              </div>
              <div className="flex gap-4 m-2 justify-center">
                <div>
                  <label htmlFor="fileInput" className="btn btn-outline btn-sm">
                    Select File
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-outline btn-sm"
                  disabled={isUploadDisabled}
                >
                  Upload
                </button>
              </div>
            </form>

            {/* Table Hasil Upload CSV */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Hasil Upload</h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">No</th>
                      <th className="border px-4 py-2">Sender Name</th>
                      <th className="border px-4 py-2">Sender City</th>
                      <th className="border px-4 py-2">Sender Country</th>
                      <th className="border px-4 py-2">Beneficiary Name</th>
                      <th className="border px-4 py-2">Beneficiary City</th>
                      <th className="border px-4 py-2">Beneficiary Country</th>
                      <th className="border px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CSVData &&
                      CSVData.slice(1).map((data, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{data[0]}</td>
                          <td className="border px-4 py-2">{data[1]}</td>
                          <td className="border px-4 py-2">{data[2]}</td>
                          <td className="border px-4 py-2">{data[3]}</td>
                          <td className="border px-4 py-2">{data[4]}</td>
                          <td className="border px-4 py-2">{data[5]}</td>
                          <td className="border px-4 py-2">
                            Waiting For Approval
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
