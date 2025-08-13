// import { useState } from "react";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";

// const Layout = ({ children }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Top Navbar */}
//       <header className="w-full">
//         <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
//       </header>

//       {/* Main area */}
//       <div className="flex flex-1 relative">
//         {/* Sidebar */}
//         <aside
//           className={`fixed inset-y-0 left-0 z-40 w-64 bg-base-100 border-r border-base-300 transform 
//           ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           transition-transform duration-300 ease-in-out
//           md:static md:translate-x-0 md:block`}
//         >
//           <Sidebar />
//         </aside>

//         {/* Main content */}
//         <main className="flex-1 overflow-y-auto p-4 md:ml-0">
//           {children}
//         </main>
//       </div>

//       {/* Overlay for mobile */}
//       {isSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={() => setIsSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default Layout;

// src/components/Layout.jsx
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main area */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-base-100 border-r border-base-300 transform
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            transition-transform duration-300 ease-in-out
            md:static md:translate-x-0`}
        >
          <Sidebar />
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
