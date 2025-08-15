// import { useState } from "react";
// import { ShipWheelIcon } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { login } from "../lib/api.js";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   const {
//     mutate: loginMutation,
//     isPending,
//     error,
//   } = useMutation({
//     mutationFn: login,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["authUser"] });
//       navigate("/");
//     },
//   });

//   const handleLogin = (e) => {
//     e.preventDefault();
//     loginMutation(loginData);
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4 
//       bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
//       data-theme="forest"
//     >
//       <div className="w-full max-w-md rounded-2xl shadow-2xl bg-base-100 overflow-hidden transform transition duration-500 hover:scale-[1.01]">
        
//         {/* Logo Section */}
//         <div className="p-6 flex flex-col items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
//           <ShipWheelIcon className="size-12 mb-2" />
//           <h1 className="text-3xl font-extrabold tracking-wide">ChatNest</h1>
//           <p className="opacity-90 mt-1 text-sm">
//             Your conversations, beautifully connected
//           </p>
//         </div>

//         {/* Form Section */}
//         <div className="p-6 sm:p-8">
//           {error && (
//             <div className="alert alert-error mb-4">
//               <span>{error?.response?.data?.message || "Login failed"}</span>
//             </div>
//           )}

//           <form onSubmit={handleLogin} className="space-y-5">
            
//             {/* Email Field */}
//             <div className="form-control w-full">
//               <label className="label font-semibold">Email</label>
//               <input
//                 type="email"
//                 placeholder="hello@example.com"
//                 className="input input-bordered w-full focus:ring focus:ring-primary"
//                 value={loginData.email}
//                 onChange={(e) =>
//                   setLoginData({ ...loginData, email: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             {/* Password Field */}
//             <div className="form-control w-full">
//               <label className="label font-semibold">Password</label>
//               <input
//                 type="password"
//                 placeholder="••••••••"
//                 className="input input-bordered w-full focus:ring focus:ring-primary"
//                 value={loginData.password}
//                 onChange={(e) =>
//                   setLoginData({ ...loginData, password: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="btn btn-primary w-full shadow-md hover:shadow-lg transition duration-300"
//               disabled={isPending}
//             >
//               {isPending ? (
//                 <>
//                   <span className="loading loading-spinner loading-xs"></span>
//                   Signing in...
//                 </>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//           {/* Extra Links */}
//           <div className="mt-6 text-center">
//             <p className="text-sm opacity-80">
//               Don’t have an account?{" "}
//               <Link
//                 to="/signup"
//                 className="text-primary font-medium hover:underline"
//               >
//                 Create one
//               </Link>
//             </p>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default LoginPage;


import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api.js";
import { motion } from "framer-motion";

const LoginPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 
      bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl shadow-lg bg-white overflow-hidden"
      >
        {/* Logo Section */}
        <div className="p-6 flex flex-col items-center bg-teal-500 text-white">
          <ShipWheelIcon className="size-12 mb-2" />
          <h1 className="text-3xl font-extrabold tracking-wide">ChatNest</h1>
          <p className="opacity-90 mt-1 text-sm">
            Your conversations, beautifully connected
          </p>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error?.response?.data?.message || "Login failed"}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="form-control w-full">
              <label className="label font-semibold">Email</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="input input-bordered w-full focus:ring focus:ring-teal-400"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-control w-full">
              <label className="label font-semibold">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full focus:ring focus:ring-teal-400"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn bg-teal-500 hover:bg-teal-600 border-none w-full shadow-md hover:shadow-lg text-white transition duration-300"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Extra Links */}
          <div className="mt-6 text-center">
            <p className="text-sm opacity-80">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-teal-500 font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
