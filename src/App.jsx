import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Arthika-app-details/dashboard";
import Income from "./Arthika-app-details/income";
import Expense from "./Arthika-app-details/expense";

const Login = lazy(() => import("./Pages/login"));
const Signup = lazy(() => import("./Pages/signup"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
