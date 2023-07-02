import React, { useEffect, useState } from "react";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";
import {
  useRefreshTokenMutation,
  useRegisterMutation,
} from "../features/users";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../app/axios";
import axios from "axios";
import { useFormik } from "formik";

export const Operator = () => {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState([]);

  const [register, { isLoading, error, data }] = useRegisterMutation();

  const navigate = useNavigate();

  useEffect(() => {
    responseToken();
    getUsers();
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

  const getUsers = async () => {
    const response = await axiosInstance.get("http://localhost:2000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: 0,
    },
    onSubmit: async (values) => {
      values.role = parseInt(values.role);
      try {
        const response = await register(values);
        if (response?.data) {
          window.add_operator_modal.close();
          getUsers();
        }
      } catch (error) {
        console.log(error);
      }
      formik.setFieldValue("name", "");
      formik.setFieldValue("email", "");
      formik.setFieldValue("password", "");
      formik.setFieldValue("role", 0);
    },
  });

  const handleFormInput = (e) => {
    const { name, value } = e.target;
    formik.setFieldValue(name, value);
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
          <div className="container p-4 mt-md-4 mt-2 border">
            <div className="flex justify-between">
              <h2 className="text-2xl font-semibold mb-6">Operator</h2>
              <button
                className="btn btn-md btn-active"
                onClick={() => window.add_operator_modal.showModal()}
              >
                Add Operator
              </button>
              <dialog id="add_operator_modal" className="modal">
                <form
                  method="dialog"
                  className="modal-box"
                  onSubmit={formik.handleSubmit}
                >
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                  <h3 className="font-bold text-lg">Add Operator</h3>
                  <div id="add_form" className="grid grid-cols-3 gap-2 py-4">
                    <div className="pb-2">
                      <label className="form-label">Name</label>
                    </div>
                    <div className="pb-2 col-span-2">
                      <input
                        onChange={handleFormInput}
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
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="btn btn-sm">Cancel</button>
                    <button className="btn btn-sm btn-success" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </dialog>
            </div>
            <div className="overflow-x-auto">
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
                          className="btn btn-sm btn-active"
                          onClick={() => window.action_edit_modal.showModal()}
                        >
                          Edit
                        </button>
                        {/* Modal Edit Operator */}
                        <dialog id="action_edit_modal" className="modal">
                          <form method="dialog" className="modal-box">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                            <h3 className="font-bold text-lg">Hello!</h3>
                            <p className="py-4">
                              Press ESC key or click on ✕ button to close
                            </p>
                          </form>
                        </dialog>
                        <button className="btn btn-sm btn-error">Delete</button>
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
  );
};
