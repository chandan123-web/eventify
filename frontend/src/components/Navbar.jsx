
// import { Link} from "react-router";
// import useAuthUser from "../hooks/Authuser.js";
// import { BellIcon, LogOutIcon, ShipWheelIcon,Plus,Menu } from "lucide-react";
// import ThemeSelector from "./ThemeSelector.jsx";
// import React from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { logout } from "../lib/api.js";
// import { useNavigate } from "react-router-dom";
// // // const navigate = useNavigate();


// // const Navbar = () => {
// //   const { authUser } = useAuthUser();
// //   const navigate = useNavigate();

// //   const queryClient = useQueryClient();
// //   const { mutate: logoutMutation } = useMutation({
// //     mutationFn: logout,
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["authUser"] })
// //       navigate("/login");
// //        }   ,
// //   });

// // //  const { logoutMutation } = useLogout();

// //   return (
// //     <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
// //       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex items-center justify-end w-full">
// //           {/* LOGO - ONLY IN THE CHAT PAGE */}
          
// //             <div className="pl-5">
// //               <Link to="/" className="flex items-center gap-2.5">
// //                 <ShipWheelIcon className="size-9 text-primary" />
// //                 <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
// //                   ChatNest
// //                 </span>
// //               </Link>
// //             </div>
          

// //           <div className="flex items-center gap-3 sm:gap-4 ml-auto">
// //             {/* <Link to={"/notifications"}> */}
// //               <button className="btn btn-ghost btn-circle">
// //                 <BellIcon className="h-6 w-6 text-base-content opacity-70" />
// //               </button>
// //             {/* </Link> */}
// //           </div>

// //             <div className="flex items-center gap-3 sm:gap-4 ml-auto">
// //             <Link to="/events">
// //               <button className="btn btn-ghost btn-circle">
// //                 < Plus className="h-6 w-6 text-base-content opacity-70" />
// //               </button>
// //             </Link>
// //           </div>

// //           {/* TODO */}

// //           <ThemeSelector />

// //           <div className="avatar">
// //             <div className="w-9 rounded-full">
// //               {/* <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" /> */}
// //             </div>
// //           </div>

// //           {/* Logout button */}
         
// //             <Link to="/events">
// //              <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
// //             <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
// //           </button>
// //             </Link>
// //         </div>
// //       </div>
// //     </nav>
// //   );
// // };
// // export default Navbar;





// const Navbar = ({ onMenuClick }) => {
//   const { authUser } = useAuthUser();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   const { mutate: logoutMutation } = useMutation({
//     mutationFn: logout,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["authUser"] });
//       navigate("/login");
//     },
//   });

//   return (
//     <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center w-full">
//         {/* Mobile Menu Button */}
//         <button
//           className="btn btn-ghost btn-circle md:hidden mr-2"
//           onClick={onMenuClick}
//         >
//           <Menu className="h-6 w-6 text-base-content opacity-70" />
//         </button>

//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2.5">
//           <ShipWheelIcon className="size-9 text-primary" />
//           <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
//             ChatNest
//           </span>
//         </Link>

//         {/* Right actions */}
//         <div className="flex items-center gap-3 sm:gap-4 ml-auto">
//           <button className="btn btn-ghost btn-circle">
//             <BellIcon className="h-6 w-6 text-base-content opacity-70" />
//           </button>

//           <Link to="/events">
//             <button className="btn btn-ghost btn-circle">
//               <Plus className="h-6 w-6 text-base-content opacity-70" />
//             </button>
//           </Link>

//           <ThemeSelector />

//           <div className="avatar">
//             <div className="w-9 rounded-full">
//               {/* Optional: <img src={authUser?.profilePic} alt="User Avatar" /> */}
//             </div>
//           </div>

//           <button
//             className="btn btn-ghost btn-circle"
//             onClick={logoutMutation}
//           >
//             <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import useAuthUser from "../hooks/Authuser.js";
import { BellIcon, LogOutIcon, ShipWheelIcon, Plus, Menu } from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api.js";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login");
    },
  });

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center w-full">
        {/* Mobile Menu */}
        <button
          className="btn btn-ghost btn-circle md:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6 text-base-content opacity-70" />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
            ChatNest
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4 ml-auto">
          <button className="btn btn-ghost btn-circle">
            <BellIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>

          <Link to="/events">
            <button className="btn btn-ghost btn-circle">
              <Plus className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </Link>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-9 rounded-full">
              {/* Optional: <img src={authUser?.profilePic} alt="User Avatar" /> */}
            </div>
          </div>

          <button
            className="btn btn-ghost btn-circle"
            onClick={logoutMutation}
          >
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
