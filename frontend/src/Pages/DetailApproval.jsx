import React from "react";
import Header from "../components/Molecules/Header";
import Navigation from "../components/Molecules/Navigation";
import { useNavigate, useParams } from "react-router-dom";
import { useGetReportDataByDataIdQuery } from "../features/users";

export const DetailApproval = () => {
  const { dataId } = useParams();
  const navigate = useNavigate();
  const { data: report, isError } = useGetReportDataByDataIdQuery(dataId);

  if (isError) {
    navigate("/dashboard");
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
                    <td>Upload By</td>
                    <td>File Name</td>
                    <td>File Size</td>
                    <td>Upload Time</td>
                    <td>Status</td>
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
                    <td>No</td>
                    <td>Sender Name</td>
                    <td>Sender City</td>
                    <td>Sender Coutry</td>
                    <td>Beneficiary Name</td>
                    <td>Beneficiary City</td>
                    <td>Beneficiary Coutry</td>
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
            <div className="flex justify-center gap-4">
              <button
                className="btn btn-outline btn-success btn-sm w-28"
                type="submit"
              >
                Approve
              </button>
              <button
                className="btn btn-outline btn-error btn-sm w-28"
                type="submit"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
