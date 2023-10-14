import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Buttons from "./components/buttons";
import Header from "./components/header";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const Auth = lazy(() => import("./pages/auth"));
const ForgotPass = lazy(() => import("./pages/forgotPass"));
const Home = lazy(() => import("./pages/home"));
const Accommodation = lazy(() => import("./pages/accommodation"));
const Registration = lazy(() => import("./pages/registration"));
const Users = lazy(() => import("./pages/users"));
const AccommodationWaitingList = lazy(() => import("./pages/accommodationWaitingList"));


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer autoClose={2000} />
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

// Define a separate component to use useLocation
function AppContent() {
  const location = useLocation();
  // Determine whether to show the logout button based on the route
  const showButton = location.pathname === "/users";
  const user=window.localStorage.userID;

  return (
    <>
      <Header />
      {showButton && <Buttons />}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/forgotPass" element={<ForgotPass />} />
          <Route path="/home" element={user? <Home />: <Navigate to="/" />} />
          <Route path="/registration" element={user? <Registration />: <Navigate to="/" />} />
          <Route path="/accommodation" element={user? <Accommodation />: <Navigate to="/" />} />
          <Route path="/accommodationWaitingList" element={user? <AccommodationWaitingList />: <Navigate to="/" />} />
          <Route path="/users" element={user? <Users />: <Navigate to="/" />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
