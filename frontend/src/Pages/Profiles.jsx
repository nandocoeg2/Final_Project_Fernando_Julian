import React from "react";
import Navigation from "../components/Molecules/Navigation";
import Header from "../components/Molecules/Header";

export const Profiles = () => {
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
            <div className="row">
              <div class="form-group col-sm-12">
                <label class="text-form-akun-pengaturan">Full Name</label>
                <input
                  type="text"
                  placeholder="Search..."
                  className="rounded-lg px-3 py-1 mr-2 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};