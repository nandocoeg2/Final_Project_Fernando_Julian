import React, { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  useRefreshTokenMutation,
  useRegisterMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../features/users";
import { axiosInstance } from "../app/axios";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";
import { useFormik } from "formik";

export const Operator = () => {
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [refreshToken] = useRefreshTokenMutation();
  const [register] = useRegisterMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    responseToken();
    getUsers();
  }, []);

  const responseToken = async () => {
    try {
      const response = await refreshToken();
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken);
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
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const confirmationDialog = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserById(id);
    }
  };
  const deleteUserById = async (id) => {
    try {
      await deleteUser(id);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:2000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: 0,
      id: 0,
    },
    preventDefault: true,
    onSubmit: async (values, { resetForm }) => {
      if (values.id === 0) {
        try {
          values.role = parseInt(values.role);
          await register(values);
          getUsers();
          window.operator_modal.close();
          resetForm();
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          values.role = parseInt(values.role.id);
          await updateUser({
            id: values.id,
            userData: {
              name: values.name,
              email: values.email,
              password: values.password,
              role: values.role,
            },
          });
          getUsers();
          window.operator_modal.close();
          resetForm();
        } catch (error) {
          console.log(error);
        }
      }
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
              <h2 className="text-2xl font-semibold mb-6">Operator</h2>
              <button
                className="btn btn-md btn-active"
                onClick={() => window.operator_modal.showModal()}
              >
                Add Operator
              </button>

              {/* Modal Add Operator */}
              <dialog id="operator_modal" className="modal">
                <form
                  method="dialog"
                  className="modal-box"
                  onSubmit={formik.handleSubmit}
                >
                  <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={(event) => {
                      event.preventDefault();
                      window.operator_modal.close();
                    }}
                  >
                    ✕
                  </button>
                  <h3 className="font-bold text-lg">Add Operator</h3>
                  <div id="add_form" className="grid grid-cols-3 gap-2 py-4">
                    <div className="pb-2">
                      <label className="form-label">Name</label>
                    </div>
                    <div className="pb-2 col-span-2">
                      <input
                        onChange={formik.handleChange}
                        type="text"
                        className="input input-bordered input-sm w-full"
                        placeholder="Name"
                        name="name"
                        value={formik.values.name}
                      />
                    </div>
                    <div className="pb-2">
                      <label className="form-label">Profile Code</label>
                    </div>
                    <div className="pb-2 col-span-2">
                      <select
                        defaultValue={0}
                        className="select select-bordered w-full select-sm"
                        value={formik.values.role}
                        name="role"
                        onChange={formik.handleChange}
                      >
                        <option disabled selected value={0}>
                          Select Profile Code
                        </option>
                        <option value={1}>Admin</option>
                        <option value={2}>Operator</option>
                        <option value={3}>Maker</option>
                      </select>
                    </div>
                    <div className="pb-2">
                      <label className="form-label">Email</label>
                    </div>
                    <div className="pb-2 col-span-2">
                      <input
                        onChange={formik.handleChange}
                        type="email"
                        className="input input-bordered input-sm w-full"
                        placeholder="Email"
                        name="email"
                        value={formik.values.email}
                      />
                    </div>
                    <div className="pb-2">
                      <label className="form-label">Password</label>
                    </div>
                    <div className="pb-2 col-span-2">
                      <input
                        onChange={formik.handleChange}
                        type="password"
                        className="input input-bordered input-sm w-full"
                        placeholder="Password"
                        name="password"
                        value={formik.values.password}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="btn btn-sm btn-success" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </dialog>
            </div>
            <div className="overflow-x-auto">
              {/* Show loading indicator or placeholder content when isLoading is true */}
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <table className="table">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Updated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  {/* body */}
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role.name}</td>
                        <td>{new Date(user.createdAt).toLocaleString()}</td>
                        <td>{new Date(user.updatedAt).toLocaleString()}</td>
                        <td className="flex gap-3">
                          <button
                            className="btn btn-sm btn-active w-20"
                            onClick={() => {
                              formik.setValues(user);
                              window.operator_modal.showModal();
                            }}
                          >
                            Edit
                          </button>
                          {/* Modal Edit Operator */}
                          <button
                            className="btn btn-sm btn-error w-20"
                            onClick={() => confirmationDialog(user.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
