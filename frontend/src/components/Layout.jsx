// src/components/Layout.jsx
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children, isSidebar = true }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        onMenuClick={toggleSidebar}
        sidebarOpen={sidebarOpen}
        isSidebar={isSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        {isSidebar && (
          <Sidebar
            isOpen={sidebarOpen}
            closeSidebar={closeSidebar}
          />
        )}

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

