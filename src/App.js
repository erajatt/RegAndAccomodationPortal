import { lazy, Suspense, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Buttons from "./components/buttons";
import Header from "./components/header";
import Loading from "./components/Loading";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import DarkModeToggle from "react-dark-mode-toggle";

const Auth = lazy(() => import("./pages/auth"));
const ForgotPass = lazy(() => import("./pages/forgotPass"));
const Home = lazy(() => import("./pages/home"));
const Accommodation = lazy(() => import("./pages/accommodation"));
const Registration = lazy(() => import("./pages/registration"));
const Users = lazy(() => import("./pages/users"));
const AccommodationWaitingList = lazy(() =>
  import("./pages/accommodationWaitingList")
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => false);
  return (
    <div className={`App${isDarkMode ? "-dark" : ""}`}>
      <BrowserRouter>
        <ToastContainer autoClose={2000} />
        <AppContent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </BrowserRouter>
    </div>
  );
}

// Define a separate component to use useLocation
function AppContent(props) {
  const location = useLocation();
  // Determine whether to show the logout button based on the route
  const showButton = location.pathname === "/users";
  const user = window.localStorage.userID;
  const isDarkMode = props.isDarkMode;
  const setIsDarkMode = props.setIsDarkMode;
  return (
    <>
      <Header />
      <div style={{ textAlign: "center", margin: "5px" }}>
        <DarkModeToggle
          onChange={setIsDarkMode}
          checked={isDarkMode}
          size={80}
        />
      </div>
      {showButton && <Buttons />}
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Auth DarkMode={isDarkMode} />} />
          <Route
            path="/forgotPass"
            element={<ForgotPass DarkMode={isDarkMode} />}
          />
          <Route
            path="/home"
            element={
              user ? <Home DarkMode={isDarkMode} /> : <Navigate to="/" />
            }
          />
          <Route
            path="/registration"
            element={
              user ? (
                <Registration DarkMode={isDarkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/accommodation"
            element={
              user ? (
                <Accommodation DarkMode={isDarkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/accommodationWaitingList"
            element={
              user ? (
                <AccommodationWaitingList DarkMode={isDarkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/users"
            element={
              user ? <Users DarkMode={isDarkMode} /> : <Navigate to="/" />
            }
          />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
