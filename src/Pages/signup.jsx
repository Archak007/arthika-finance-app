import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = (data) => {
    console.log("signup", data);
    // Save user data to localStorage
    localStorage.setItem("user", JSON.stringify(data));
    alert("Signup successful! You can now log in.");
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.82 0.04 208.35)" }}
    >
      <div className="max-w-3xl w-full grid grid-cols-2 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left: branding */}
        <div className="p-8 bg-gradient-to-b from-teal-800 to-teal-700 text-white flex flex-col items-center justify-center">
          <img src={logo} alt="Arthika" className="h-16 mb-4" />
          <h2 className="text-2xl font-bold">Arthika</h2>
          <p className="mt-2 text-sm opacity-90">Your financial companion</p>
        </div>

        {/* Right: form */}
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-4">Create Account</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Full Name"
                className="w-full p-2 border rounded"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                {...register("email", {
                  required: "Email required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                {...register("password", {
                  required: "Password required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                placeholder="Confirm Password"
                className="w-full p-2 border rounded"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}