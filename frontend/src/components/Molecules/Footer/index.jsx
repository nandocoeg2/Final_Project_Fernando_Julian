import React from "react";

export const Footer = () => {
  return (
    <footer className="py-4">
      <div className="container mx-auto text-center">
        <p className="text-gray-600">
          &copy; {new Date().getFullYear()} Fernando Julian. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};
