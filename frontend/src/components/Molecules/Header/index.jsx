import React from "react";

const Header = ({ handleSearch }) => {
  return (
    <>
      <header className="bg-gray-200 py-4 px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          {/* Pencarian (Search) */}
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              className="rounded-lg px-3 py-1 mr-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded-lg focus:outline-none"
            >
              Search
            </button>
          </form>
        </div>
      </header>
    </>
  );
};

export default Header;
