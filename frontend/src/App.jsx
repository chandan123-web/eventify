import useAuthUser from "./hooks/Authuser.js";
import { useThemeStore } from "./store/useThemeSelector.js";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUpPage from "./pages/Signuppage.jsx";
import LoginPage from "./pages/Loginpage.jsx";
import HomePage from "./pages/Homepage.jsx";



import Sidebar from "./components/Sidebar.jsx";
import ThemeSelector from "./components/ThemeSelector.jsx";
import Layout from "./components/Layout.jsx";
import Navbar from "./components/Navbar.jsx";
import CreateEventPage from "./pages/EventPage.jsx";
import PageLoader from "./pages/PageLoader.jsx";
import EventGallery from "./pages/EventGallery.jsx";
const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  //const isOnboarded = authUser?.isOnboarded;

 if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Layout >
                <HomePage />
              </Layout>
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? <SignUpPage /> : <Layout >
                <HomePage />
              </Layout>} />
          
        
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Layout >
                <HomePage />
              </Layout>} />
          
        {/* <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        /> */}
        {/* <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        /> */}

        <Route
          path="/events"
          element={
            isAuthenticated ? (
             <CreateEventPage/>
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/events/:eventId/media"
          element={
         <EventGallery />

          }/>

    
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
