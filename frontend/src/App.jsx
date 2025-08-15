import useAuthUser from "./hooks/Authuser.js";

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUpPage from "./pages/Signuppage.jsx";
import LoginPage from "./pages/Loginpage.jsx";
import HomePage from "./pages/Homepage.jsx";
import EventRoom from "./pages/EventRoom.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";


import Sidebar from "./components/Sidebar.jsx";

import Layout from "./components/Layout.jsx";
import Navbar from "./components/Navbar.jsx";
import CreateEventPage from "./pages/EventPage.jsx";
import PageLoader from "./pages/PageLoader.jsx";
import EventGallery from "./pages/EventGallery.jsx";


import FriendsFeed from "./pages/FriendsFeedpage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import CreatePostPage from "./pages/CreatePost.jsx";
const App = () => {
  const { isLoading, authUser } = useAuthUser();
  

  const isAuthenticated = Boolean(authUser);
  //const isOnboarded = authUser?.isOnboarded;

 if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" >
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


        <Route path="/feed" element={<FriendsFeed />} />
        <Route path="/profile/:id" element={<ProfilePage />} /> 
        <Route path="/create-post" element={<CreatePostPage />} />


        <Route
          path="/events/:eventId/media"
          element={
             <Layout showSidebar={false}>
                <EventGallery />
              </Layout>
         

          }/>
        <Route
          path="/events/:eventId/chat"
          element={
               <Layout >
                <ChatPage />
              </Layout>
          }/>

             <Route path="/call/:eventId" element={<CallPage />} />
            
                


    
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
