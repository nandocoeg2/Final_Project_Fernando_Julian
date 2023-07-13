import React from "react";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";
import { useGetRoleMenuQuery } from "../features/users";
import { useGetAllMenuQuery } from "../features/users";
import useFormik from "formik";

export const Profiles = () => {
  const {
    data: roleMenuData,
    isLoading: roleMenuLoading,
    isError: roleMenuError,
  } = useGetRoleMenuQuery();

  const {
    data: allMenuData,
    isLoading: allMenuLoading,
    isError: allMenuError,
  } = useGetAllMenuQuery();

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
            <h2 className="text-2xl font-semibold mb-6">Profiles</h2>
            <div className="p-8 my-2">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Role</th>
                    <th>Menu Allowed</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {roleMenuLoading ? (
                    <tr>
                      <td colSpan="4">
                        <center>
                          <span className="loading loading-infinity loading-lg"></span>
                        </center>
                      </td>
                    </tr>
                  ) : roleMenuData ? (
                    roleMenuData.map((roleMenu, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{roleMenu.name}</td>
                        <td>
                          {roleMenu.menus.map((menu, index) => (
                            <div
                              className="badge badge-outline mx-1"
                              key={index}
                            >
                              {menu.name}
                            </div>
                          ))}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => window.edit_role_menu.showModal()}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Error loading role menu data.</td>
                    </tr>
                  )}
                </tbody>

                <dialog id="edit_role_menu" className="modal">
                  <form method="dialog" className="modal-box">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                    <h3 className="font-bold text-lg">Edit!</h3>
                    <label className="label">
                      <span className="label-text">Role selected</span>
                    </label>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Menu Allowed</span>
                      </label>
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">Menu 1</span>
                          <input type="checkbox" className="checkbox" />
                        </label>
                        <label className="label cursor-pointer">
                          <span className="label-text">Menu 2</span>
                          <input type="checkbox" className="checkbox" />
                        </label>
                      </div>
                    </div>

                    <div className="form-control mt-6">
                      <input
                        type="submit"
                        className="btn btn-primary"
                        value="Submit"
                      />
                    </div>
                  </form>
                </dialog>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
