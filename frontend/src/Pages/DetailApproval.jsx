import React, { useEffect, useState } from "react";
import Header from "../components/Molecules/Header";
import Navigation from "../components/Molecules/Navigation";
import { redirect, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useFormik } from "formik";
import {
  useGetReportDataByDataIdQuery,
  usePatchReportDataMutation,
  useRefreshTokenMutation,
} from "../features/users";
import { axiosInstance } from "../app/axios";

export const DetailApproval = () => {
  const { dataId } = useParams();
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [role, setRole] = useState("");
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
  const { data: report, isError } = useGetReportDataByDataIdQuery(dataId);
  const [patchReportData, { isLoading: isPatchLoading, data: patchData }] =
    usePatchReportDataMutation();
  const formik = useFormik({
    initialValues: {
      statusReportId: "",
    },
    onSubmit: async (values) => {
      const data = {
        statusReportId: parseInt(values.statusReportId),
      };
      await patchReportData({ id: parseInt(dataId), statusReportId: data });
      navigate(`/report/detail/${dataId}`, { replace: true });
      window.location.reload();
    },
  });

  if (isError) {
    navigate("/dashboard", { replace: true });
  }

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
            <h2 className="text-2xl font-semibold mb-6">Details</h2>
            <div className="p-8 my-2">
              <h2 className="text-2xl font-semibold mb-6">
                Report Batch Details
              </h2>
              {report ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Upload By</th>
                      <th>File Name</th>
                      <th>File Size</th>
                      <th>Upload Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{report.uploadByUser.name}</td>
                      <td>{report.name}</td>
                      <td>{report.size}</td>
                      <td>{new Date(report.createdAt).toLocaleString()}</td>
                      <td>{report.statusReport.name}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <center>
                  <span className="loading loading-infinity loading-lg"></span>;
                </center>
              )}
            </div>
            <div className="p-8 my-2">
              <h2 className="text-2xl font-semibold mb-6">
                Report File Details
              </h2>
              {report ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Sender Name</th>
                      <th>Sender City</th>
                      <th>Sender Coutry</th>
                      <th>Beneficiary Name</th>
                      <th>Beneficiary City</th>
                      <th>Beneficiary Coutry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.dataUploads.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.senderName}</td>
                        <td>{item.senderCity}</td>
                        <td>{item.senderCountry}</td>
                        <td>{item.beneficiaryName}</td>
                        <td>{item.beneficiaryCity}</td>
                        <td>{item.beneficiaryCountry}</td>
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
            <div className="p-8 my-2">
              <form onSubmit={formik.handleSubmit}>
                <div className="flex justify-center gap-4">
                  {report && report.statusReport.id === 1 && (
                    <>
                      <button
                        className="btn btn-outline btn-success btn-sm w-28"
                        onClick={() =>
                          formik.setFieldValue("statusReportId", 2)
                        }
                        type="submit"
                        disabled={isPatchLoading}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-outline btn-error btn-sm w-28"
                        onClick={() =>
                          formik.setFieldValue("statusReportId", 3)
                        }
                        type="submit"
                        disabled={isPatchLoading}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
