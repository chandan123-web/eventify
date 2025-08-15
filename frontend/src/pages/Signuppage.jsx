import { useState, useRef } from "react";
import { ShipWheelIcon, Camera, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api.js";

const SignUpPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    coverImage: null,
  });

  const { mutate: signupMutation, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", signupData.name);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    if (signupData.coverImage) {
      formData.append("coverImage", signupData.coverImage);
    }
    signupMutation(formData);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-white"
      data-theme="forest"
    >
      <div className="border border-primary/20 flex flex-col lg:flex-row w-full max-w-xl mx-auto bg-base-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="w-full p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              ChatNest
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error mb-4 text-sm">
              <span>{error?.response?.data?.message || "Something went wrong"}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-4 relative">
              <div className="relative w-24 h-24 group">
                {signupData.coverImage ? (
                  <img
                    src={URL.createObjectURL(signupData.coverImage)}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border border-primary/30 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border border-primary/30 shadow-sm">
                    <User className="w-12 h-12 text-gray-500" />
                  </div>
                )}

                {/* Camera Icon Overlay */}
                <button
                  type="button"
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full shadow-lg hover:bg-primary-focus transition"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) =>
                  setSignupData({ ...signupData, coverImage: e.target.files[0] })
                }
              />
              <p className="text-xs text-gray-500 mt-2">Upload your profile image</p>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={signupData.name}
                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@gmail.com"
                className="input input-bordered w-full"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <p className="text-xs opacity-70 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            {/* Terms */}
            <div className="form-control">
              <label className="label cursor-pointer gap-2 items-start">
                <input type="checkbox" className="checkbox checkbox-sm mt-1" required />
                <span className="text-xs">
                  I agree to the{" "}
                  <span className="text-primary hover:underline">terms of service</span> and{" "}
                  <span className="text-primary hover:underline">privacy policy</span>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button className="btn btn-primary w-full" type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Already have account */}
            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
