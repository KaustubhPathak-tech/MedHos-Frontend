import * as api from "../api";
// import { message } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { setCurrentUser } from "./currentUser";

export const getAllDoctors = () => async (dispatch) => {
    try {
      const { data } = await api.getAllDoctors();
      dispatch({type: "GET_ALL_DOCTORS",payload: data});
    } catch (error) {
      toast.error(error.response.data);
      <ToastContainer />;
    }
  };