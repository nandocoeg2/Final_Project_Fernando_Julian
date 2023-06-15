import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={Login()} />
        <Route path="/register" element={<div>Register</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
