import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import {
  LoginPage,
  RegisterPage,
  Dashboard,
  Profiles,
  Operator,
  FileUpload,
  Report,
  Approval,
  LandingPage,
} from "./Pages/index";
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profiles />} />
          <Route path="/operator" element={<Operator />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/report" element={<Report />} />
          <Route path="/approval" element={<Approval />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
