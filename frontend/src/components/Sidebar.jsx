// src/components/Sidebar.jsx
import { motion } from "framer-motion";
import { Home, Calendar, Users, Image, LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import { useMediaQuery } from "react-responsive";

const navLinks = [
  { name: "Home", icon: <Home size={18} />, href: "/" },
  { name: "Events", icon: <Calendar size={18} />, href: "/events" },
  { name: "Users", icon: <Users size={18} />, href: "/users" },
  { name: "Media", icon: <Image size={18} />, href: "/media" },
];

export default function Sidebar({ isOpen, closeSidebar }) {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery({ maxWidth: 1024 });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries(["authUser"]);
      if (isMobile) closeSidebar();
    },
  });

  return (
    <motion.aside
      initial={{ x: isMobile ? "-100%" : 0 }}
      animate={{ x: isOpen || !isMobile ? 0 : "-100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className={`bg-white border-r h-full w-64 flex-shrink-0 z-20 lg:static fixed top-[56px]`}
    >
      <nav className="flex flex-col h-full">
        <ul className="flex-1 p-4 space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={() => isMobile && closeSidebar()}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-gray-700"
              >
                {link.icon}
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={() => logoutMutation.mutate()}
            className="flex items-center gap-3 px-3 py-2 rounded w-full text-left hover:bg-red-50 text-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>
    </motion.aside>
  );
}



// src/components/Sidebar.jsx
// src/components/Sidebar.jsx
// src/components/Sidebar.jsx
// src/components/Sidebar.jsx
// import { motion } from "framer-motion";
// import { Home, Calendar, Users, Image, LogOut } from "lucide-react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { logout } from "../lib/api";
// import { useMediaQuery } from "react-responsive";

// const navLinks = [
//   { name: "Home", icon: <Home size={18} />, href: "/" },
//   { name: "Events", icon: <Calendar size={18} />, href: "/events" },
//   { name: "Users", icon: <Users size={18} />, href: "/users" },
//   { name: "Media", icon: <Image size={18} />, href: "/media" },
// ];

// export default function Sidebar({ isOpen, closeSidebar }) {
//   const queryClient = useQueryClient();
//   const isMobile = useMediaQuery({ maxWidth: 1024 });

//   const logoutMutation = useMutation({
//     mutationFn: logout,
//     onSuccess: () => {
//       queryClient.invalidateQueries(["authUser"]);
//       if (isMobile) closeSidebar();
//     },
//   });

//   return (
//     <motion.aside
//       initial={{ opacity: 0, x: isMobile ? -100 : 0 }}
//       animate={{ opacity: 1, x: isOpen || !isMobile ? 0 : -100 }}
//       exit={{ opacity: 0, x: -100 }}
//       transition={{ type: "spring", stiffness: 80, damping: 14 }}
//       className="bg-white text-gray-800 h-full w-64 flex-shrink-0 z-38 lg:static fixed top-[56px] shadow-md border-r border-gray-200"
//     >
//       <nav className="flex flex-col h-full">
//         <ul className="flex-1 p-4 space-y-2">
//           {navLinks.map((link, index) => (
//             <motion.li
//               key={link.name}
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: index * 0.1, duration: 0.3 }}
//             >
//               <a
//                 href={link.href}
//                 onClick={() => isMobile && closeSidebar()}
//                 className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:translate-x-1"
//               >
//                 <motion.span
//                   whileHover={{ scale: 1.2, rotate: 5 }}
//                   className="p-1 rounded-full bg-gray-100"
//                 >
//                   {link.icon}
//                 </motion.span>
//                 <span>{link.name}</span>
//               </a>
//             </motion.li>
//           ))}
//         </ul>

//         {/* Logout Button */}
//         <div className="p-4 border-t border-gray-200">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => logoutMutation.mutate()}
//             className="flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left bg-gray-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
//           >
//             <LogOut size={18} />
//             Logout
//           </motion.button>
//         </div>
//       </nav>
//     </motion.aside>
//   );
// }
