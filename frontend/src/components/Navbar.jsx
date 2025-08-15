// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { getAuthUser, logout } from "../lib/api";
// import { Menu, X, LogOut, Bell, Users, Search } from "lucide-react";
// import { motion } from "framer-motion";

// export default function Navbar({ onMenuClick, sidebarOpen, isSidebar }) {
//   const queryClient = useQueryClient();

//   const { data: user } = useQuery({
//     queryKey: ["authUser"],
//     queryFn: getAuthUser,
//   });

//   const logoutMutation = useMutation({
//     mutationFn: logout,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["authUser"]);
//     },
//   });

//   return (
//     <motion.nav
//       initial={{ y: -50, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//       className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg px-4 py-2"
//     >
//       {/* Container for large screens */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         {/* Left side - Logo & Sidebar Toggle */}
//         <div className="flex items-center gap-3">
//           {isSidebar && (
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               onClick={onMenuClick}
//               className="lg:hidden p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white"
//             >
//               {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
//             </motion.button>
//           )}

//           <motion.a
//             href="/"
//             className="flex items-center gap-2"
//             whileHover={{ scale: 1.05 }}
//           >
//             <Users size={32} className="text-white drop-shadow-md" />
//             <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wide">
//               EventSphere
//             </span>
//           </motion.a>
//         </div>

//         {/* Search Bar - Large/Medium screens */}
//         <div className="hidden sm:flex flex-1 max-w-md">
//           <motion.div
//             whileFocus={{ scale: 1.02 }}
//             className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/30 focus-within:border-yellow-300 shadow-inner transition"
//           >
//             <Search size={18} className="text-white/80 mr-2" />
//             <input
//               type="text"
//               placeholder="Search events, friends..."
//               className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/70"
//             />
//           </motion.div>
//         </div>

//         {/* Right side - Icons */}
//         <div className="flex items-center gap-3">
//           {/* Notifications */}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             className="relative p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
//           >
//             <Bell size={20} />
//             <span className="absolute top-1 right-1 block h-2 w-2 bg-yellow-300 rounded-full ring-2 ring-white"></span>
//           </motion.button>

//           {/* Avatar */}
//           {user && (
//             <motion.img
//               whileHover={{ scale: 1.05 }}
//               src={user.avatar || "https://via.placeholder.com/40"}
//               alt="User Avatar"
//               className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
//             />
//           )}

//           {/* Logout */}
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             onClick={() => logoutMutation.mutate()}
//             className="p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white"
//           >
//             <LogOut size={20} />
//           </motion.button>
//         </div>
//       </div>

//       {/* Search Bar - Mobile only */}
//       <div className="sm:hidden mt-3">
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-3 py-2 border border-white/30 focus-within:border-yellow-300 shadow-inner transition"
//         >
//           <Search size={18} className="text-white/80 mr-2" />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/70"
//           />
//         </motion.div>
//       </div>
//     </motion.nav>
//   );
// }

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuthUser, logout } from "../lib/api";
import { Menu, X, LogOut, Bell, Users, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ onMenuClick, sidebarOpen, isSidebar }) {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
    },
  });

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 
      bg-[#f9f9f9] text-gray-800 shadow-md px-4 py-2"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isSidebar && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          )}
          <motion.a
            href="/"
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <Users size={32} className="text-gray-700" />
            <span className="text-xl sm:text-2xl font-bold font-sans">
              EventSphere
            </span>
          </motion.a>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden sm:flex flex-1 justify-center">
          <motion.div
            whileFocus={{ scale: 1.02 }}
            className="flex items-center bg-gray-100 rounded-full px-3 py-1 border border-gray-300 focus-within:border-gray-500 transition w-full max-w-md"
          >
            <Search size={18} className="text-gray-600 mr-2" />
            <input
              type="text"
              placeholder="Search events, friends..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
            />
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="relative p-2 rounded-full hover:bg-gray-200 transition"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </motion.button>

          {user && (
            <motion.img
              whileHover={{ scale: 1.05 }}
              src={user.avatar || "https://via.placeholder.com/40"}
              alt="User Avatar"
              className="w-9 h-9 rounded-full border border-gray-300 shadow-sm"
            />
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => logoutMutation.mutate()}
            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
          >
            <LogOut size={20} />
          </motion.button>
        </div>
      </div>

      {/* Search Bar - Mobile */}
      <div className="sm:hidden mt-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center bg-gray-100 rounded-full px-3 py-2 border border-gray-300 focus-within:border-gray-500 transition"
        >
          <Search size={18} className="text-gray-600 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
          />
        </motion.div>
      </div>
    </motion.nav>
  );
}
