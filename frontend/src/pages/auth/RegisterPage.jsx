import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, AtSign, CheckCircle } from "lucide-react";
import axios from "axios";
import AuthLayout from "../../components/layout/AuthLayout";
import Input from "../../components/common/Input";
import { API_ORIGIN } from "../../config/env.js";

const API_BASE = API_ORIGIN;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile", { replace: true });
    }
  }, [navigate]);

  // Validation logic
  useEffect(() => {
    const {
      fullName,
      username,
      email,
      password,
      confirmPassword,
      agreeToTerms,
    } = formData;

    const newErrors = {};
    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    const isValid =
      fullName.trim() !== "" &&
      username.trim() !== "" &&
      email.includes("@") &&
      password.length >= 6 &&
      password === confirmPassword &&
      agreeToTerms;

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear form-level error when user types
    if (errors.form) {
      setErrors((prev) => ({ ...prev, form: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setErrors({});

    try {
      await axios.post(`${API_BASE}/api/auth/register`, {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      // Registration successful — navigate to login with success message
      navigate("/login", {
        state: {
          successMessage: "Account created successfully. Please login.",
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      const message =
        error.response?.data?.message ||
        "Unable to connect to server. Please check backend.";
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join ConnectHub and start connecting"
      backgroundVariant="solid"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Form-level error */}
        {errors.form && (
          <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {errors.form}
            </p>
          </div>
        )}

        <Input
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          icon={User}
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <Input
          label="Username"
          name="username"
          placeholder="johndoe123"
          icon={AtSign}
          value={formData.username}
          onChange={handleChange}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          icon={Lock}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          icon={Lock}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
        />

        <div className="flex items-start gap-2 mt-1">
          <div className="relative flex items-center mt-0.5">
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-black transition-all"
            />
            <svg
              className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 -translate-x-1/2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
            I agree to the{" "}
            <span className="text-black dark:text-white font-semibold cursor-pointer hover:underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-black dark:text-white font-semibold cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </span>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`
            w-full py-3.5 mt-2 rounded-xl font-bold transition-all duration-200
            ${
              isFormValid && !isLoading
                ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-[0.98]"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating account...</span>
            </div>
          ) : (
            "Sign Up"
          )}
        </button>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 dark:border-gray-800"></div>
          </div>
          <span className="relative px-4 bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 text-xs font-medium uppercase tracking-wider">
            OR
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            // TODO: replace with real Google OAuth once backend is ready
            console.log("Continuing with Google (temp bypass)...");
          }}
          className="w-full py-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Continue with Google
          </span>
        </button>

        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-black dark:text-white font-bold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
