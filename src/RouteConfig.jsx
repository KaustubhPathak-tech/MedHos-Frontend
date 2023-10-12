import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LandingPage from "./Pages/Landing Page/LandingPage";
import UserLogin from "./Pages/User/UserLogin/UserLogin";
import UserDash from "./Pages/User/UserDash/UserDash";
import HomePage from "./Pages/HomePage";
import DoctorLogin from "./Pages/Doctor/DoctorLogin/DoctorLogin";
import DoctorDash from "./Pages/Doctor/DoctorDash/DoctorDash";
import Missing from "./Pages/Missing/Missing";
import Payment from "./Pages/Payment";
import Room from "./Components/Screen/Room";
import ProtectedRoute from "./Components/ProtectedRoute";
import PublicRoute from "./Components/PublicRoute";
import NotificationPage from "./Pages/NotificationPage";
import Users from "./Pages/admin/Users";
import Doctors from "./Pages/admin/Doctors";
import BookingPage from "./Pages/BookingPage";
import Appointments from "./Pages/Appointments";
import DoctorAppointments from "./Pages/Doctor/DoctorAppointments";
import Profile from "./Pages/Doctor/profile";
import ResponsiveAppBar from "./Components/Navbar/Navbar";
import UserDoctor from "./Pages/User/UserDoctor/UserDoctor";

import ScrolltoTop from "./Components/ScrolltoTop";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import Home from "./Pages/admin/Home";
import Navbartest from "./Components/Navbartest";
import Medicines from "./Pages/Medicines/Medicines";
import Medicine from "./Pages/Medicines/Medicine";
import Cart from "./Pages/Cart/Cart";
import AdminOrders from "./Pages/admin/AdminOrders";
import UserOrders from "./Pages/User/UserOrders/UserOrders";
const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const RouteConfig = ({ change }) => {
  //theme setting
  const User = useSelector((state) => state.fetch_current_userReducer);
  const [checked, setChecked] = useState(true);
  const handleTheme = () => {
    try {
      setChecked(!checked);
      localStorage.setItem("theme", checked);
      // console.log(localStorage.getItem("theme"));
    } catch (error) {
      alert(error);
    }
  };
  var isTrueSet = localStorage.getItem("theme") === "true";
  if (isTrueSet) {
    var theme = darkTheme;
  } else {
    theme = lightTheme;
  }
  return (
    <BrowserRouter>
      <ScrolltoTop />
      <ResponsiveAppBar change={handleTheme} />
      <Routes>
        <Route exact path="/" element={<LandingPage />} />

        <Route
          path="/user/login"
          element={
            <PublicRoute>
              <UserLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/user/dash"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/dash"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/doctor-consult"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/login"
          element={
            <PublicRoute>
              <DoctorLogin />
            </PublicRoute>
          }
        />

        <Route path="/doctor/dash" element={<DoctorDash />} />
        <Route path="/payment" element={<Payment />} />

        <Route
          path="/consultation-Room/:roomid"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Missing />} />

        {/* new routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/doctor/book-appointment/:doctorId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/doctor"
          element={
            <ProtectedRoute>
              <UserDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/orders"
          element={
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path={`${User?.user?.userType}/notifications`}
          element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicines"
          element={
            <ProtectedRoute>
              <Medicines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medicines/:medicineid"
          element={
            <ProtectedRoute>
              <Medicine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        {/* <Route
            path="/searchwithvoice"
            element={
              <ProtectedRoute>
                <ChatComponent />
              </ProtectedRoute>
            }
          /> */}
        <Route path="/test" element={<Navbartest />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteConfig;
