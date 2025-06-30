import { SignupInput } from "@jyoti_ranj/common";
import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    username: "",
    password: ""
  });

  async function sendRequest() {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/users/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const jwt = response.data.token;
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-lexend font-extrabold">
              {type === "signup" ? "Create an account" : "Welcome Back!"}
            </div>
            <div className="mt-2 text-slate-500 text-sm">
              {type === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}
              <Link
                to={type === "signup" ? "/signin" : "/signup"}
                className="underline text-blue-800 px-1.5"
              >
                {type === "signup" ? "Login" : "Sign up"}
              </Link>
            </div>
          </div>

          <div className="mt-6">
            {type === "signup" && (
              <LabelledInput
                label="Name"
                placeholder="Jyoti Ranjan Sethi"
                onChange={(e) =>
                  setPostInputs((c) => ({ ...c, name: e.target.value }))
                }
              />
            )}
            <LabelledInput
              label="Email"
              placeholder="m@example.com"
              onChange={(e) =>
                setPostInputs((c) => ({ ...c, username: e.target.value }))
              }
            />
            <LabelledInput
              label="Password"
              type="password"
              placeholder="********"
              onChange={(e) =>
                setPostInputs((c) => ({ ...c, password: e.target.value }))
              }
            />
          </div>

          <button
            onClick={sendRequest}
            type="button"
            className="mt-6 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-4 py-2"
          >
            {type === "signup" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
