// Label.jsx
import React from "react";

const Label = ({ htmlFor, children }) => {
  return <label htmlFor={htmlFor}>{children}</label>;
};

export default Label;
