import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="w-full">
        <Navbar />
      </header>

      {/* Main area with Sidebar and Content */}
      <div className="flex flex-1">
        <aside className="w-64 flex-shrink-0">
          <Sidebar />
        </aside>

        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
