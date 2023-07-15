import React from "react";
import { useFormik } from "formik";

export const Modal = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      role: 0,
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <dialog id="action_edit_modal" className="modal">
        <form
          method="dialog"
          className="modal-box"
          onSubmit={formik.handleSubmit}
        >
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => window.action_edit_modal.close()}
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
    </>
  );
};
