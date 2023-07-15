import React from "react";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";
import {
  useGetRoleMenuQuery,
  useGetAllMenuQuery,
  useUpdateMenuMutation,
} from "../features/users";
import { useFormik } from "formik";

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

  const [updateMenu] = useUpdateMenuMutation();

  const formik = useFormik({
    initialValues: {
      roleId: "",
      menuIds: [],
    },
    onSubmit: (values) => {
      updateMenu({ menuData: values });
      document.getElementById("edit_role_menu").close();
      window.location.reload();
    },
  });

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
            <div className="flex justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Profiles</h2>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    document.getElementById("edit_role_menu").showModal();
                  }}
                >
                  Edit Menu
                </button>
              </div>
            </div>

            <div className="p-8 my-2">
              <table className="table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Role</th>
                    <th>Menu Allowed</th>
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
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">Error loading role menu data.</td>
                    </tr>
                  )}
                </tbody>

                <dialog id="edit_role_menu" className="modal ">
                  <form
                    onSubmit={formik.handleSubmit}
                    className="modal-box w-11/12"
                  >
                    <p className="text-lg font-semibold">Edit Role Menu</p>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-base">
                          Role
                        </span>
                      </label>
                      <select
                        name="roleId"
                        onChange={formik.handleChange}
                        value={formik.values.role}
                        className="select select-bordered select-primary w-full max-w-xs"
                        defaultValue={0}
                      >
                        <option value={0} disabled>
                          Select Role
                        </option>
                        <option value={1}>Admin</option>
                        <option value={2}>Operator</option>
                        <option value={3}>Maker</option>
                      </select>
                    </div>
                    <label className="label">
                      <span className="label-text font-semibold text-base">
                        Menu Allowed
                      </span>
                    </label>
                    <div className="form-control">
                      {allMenuLoading ? (
                        <span className="loading loading-lg"></span>
                      ) : allMenuError ? (
                        <span>Error loading menu data.</span>
                      ) : (
                        allMenuData &&
                        allMenuData.map((menu, index) => (
                          <label
                            className="label cursor-pointer"
                            key={index}
                            htmlFor={menu.id}
                          >
                            <span className="label-text">{menu.name}</span>
                            <input
                              type="checkbox"
                              className="checkbox"
                              name="menuIds"
                              value={menu.id}
                              onChange={formik.handleChange}
                              id={menu.id}
                            />
                          </label>
                        ))
                      )}
                    </div>

                    <div className="modal-action">
                      <button
                        type="button"
                        className="btn btn-outline w-20"
                        onClick={() => {
                          document.getElementById("edit_role_menu").close();
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success w-20">
                        Save
                      </button>
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
