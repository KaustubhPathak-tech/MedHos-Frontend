import * as api from "../api";
import { message } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCurrentUser } from "./currentUser";
import { json } from "react-router-dom";

export const signup = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(authData);
    dispatch({ type: "SIGNUP", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    localStorage.setItem(
      "cart",
      JSON.stringify(JSON.parse(localStorage.getItem("Profile"))?.cart)
    );
    navigate("/user/dash");
    setTimeout(() => {}, 2000);
    message.success("Registered Successfully ", { position: "top-center" });
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};

export const sendOTP = (authData) => async () => {
  try {
    const { data } = await api.sendOTP(authData);
    toast.success("OTP sent Successfully ");
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};
export const makePayment = () => async () => {
  try {
    const { data } = await api.makePayment();
    toast.success("Payment Done ");
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};
export const verifyOTP = (authData, setOtpverified) => async () => {
  try {
    const { data } = await api.verifyOTP(authData);
    localStorage.setItem("OTPVerified", data);
    setOtpverified(true);
    toast.success("Email verified Successfully ");
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};

export const doctorsignup = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.doctorsignUp(authData);
    dispatch({ type: "SIGNUP", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    navigate("/doctor/dash");
    setTimeout(() => {}, 2000);
    message.success("Registered as Doctor Successfully");
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};
export const login = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.logIn(authData);

    dispatch({ type: "LOGIN", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    console.log(JSON.parse(localStorage.getItem("Profile"))?.cart);
    localStorage.setItem(
      "cart",
      JSON.stringify(JSON.parse(localStorage.getItem("Profile"))?.cart)
    );
    navigate("/user/dash");
    setTimeout(() => {}, 2000);
    // message.success("Login Successful", { position: "top-center" });
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};
export const doctorlogin = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.dlogIn(authData);
    dispatch({ type: "LOGIN", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    const notification = data?.user?.notification;
    const seennotification = data?.user?.seennotification;
    localStorage.setItem("Notification", JSON.stringify({ notification }));
    localStorage.setItem(
      "SeenNotification",
      JSON.stringify({ seennotification })
    );
    navigate("/doctor/dash");
    setTimeout(() => {}, 2000);
    // message.success("Login Successful", { position: "top-center" });
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};
export const logout = () => async (dispatch) => {
  try {
    dispatch(setCurrentUser(null));
    localStorage.clear();
    message.success("Logout Successfully");
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};

export const glogin = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.glogIn(authData);
    dispatch({ type: "LOGIN", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    console.log(JSON.parse(localStorage.getItem("Profile"))?.cart);
    localStorage.setItem(
      "cart",
      JSON.stringify(JSON.parse(localStorage.getItem("Profile"))?.cart)
    );
    navigate("/user/dash");
    // setTimeout(() => {}, 2000);
    // message.success("Login Successful", { position: "top-center" });
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};

export const getUserData = () => async (dispatch) => {};
export const getUserAppointments = () => async (dispatch) => {
  try {
    const { data } = await api.getUserAppointments();
    dispatch({ type: "GET_USER_APPOINTS", payload: data });
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};
export const saveOrder = (authData) => async (dispatch) => {
  try {
    const {data}=await api.saveOrder(authData);
    dispatch({ type: "ADD_TO_CART", data });
    localStorage.setItem(
      "cart",
      JSON.stringify(JSON.parse(localStorage.getItem("updateUser"))?.data)
    );
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};
export const getOrder = (authData) => async (dispatch) => {
  try {
    const {data}=await api.getOrder(authData);
    console.log(data);
    dispatch({ type: "GET_ORDER", payload: data });
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};
export const getAdminOrders = () => async (dispatch) => {
  try {
    const {data}=await api.getAdminOrders();
    console.log(data);
    dispatch({ type: "GET_ORDER", payload: data });
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};


export const updateOrderStatus = (authData) => async (dispatch) => {
  try {
    const {data}=await api.updateOrderStatus(authData);
    console.log(data);
    dispatch({ type: "GET_ORDER", payload: data });
  } catch (error) {
    toast.error(error.response.data);
    <ToastContainer />;
  }
};

