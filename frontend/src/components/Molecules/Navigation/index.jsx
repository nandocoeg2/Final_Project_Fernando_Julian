import React from "react";

const Navigation = () => {
  return (
    <>
      <nav className="bg-gray-800 text-white w-64 p-4">
        <ul>
          <li className="mb-2">
            <a href="/dashboard" className="text-white hover:text-gray-300">
              Dashboard
            </a>
          </li>
          <li className="mb-2">
            <a
              href="https://google.com/"
              className="text-white hover:text-gray-300"
            >
              Orders
            </a>
          </li>
          <li className="mb-2">
            <a
              href="https://google.com/"
              className="text-white hover:text-gray-300"
            >
              Customers
            </a>
          </li>
          <li className="mb-2">
            <a
              href="https://google.com/"
              className="text-white hover:text-gray-300"
            >
              Products
            </a>
          </li>
          <li>
            <a
              href="https://google.com/"
              className="text-white hover:text-gray-300"
            >
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
