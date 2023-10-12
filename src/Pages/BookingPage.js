import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Booking.css";
import videoImg from "../Assets/video-consult.png";
import Layout from "../Components/Layout";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import { Button, DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../ToolkitReducers/alertSlice";
import { getAllDoctors } from "../actions/doctor";

const BookingPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDoctors());
  }, [getAllDoctors]);
  const user = useSelector((state) => state.fetch_current_userReducer);
  const doctordata = useSelector((state) => state.doctorReducer);
  const doctors = doctordata?.data?.data?.filter(
    (doctor) => doctor._id === params.doctorId
  )[0];
  // const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);

  // login user data
  // const getUserData = async () => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:7000/doctor/getDoctorById",
  //       { doctorId: params.doctorId },
  //       {
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("Profile"),
  //         },
  //       }
  //     );
  //     if (res.data.success) {
  //       setDoctors(res.data.data);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // ============ handle availiblity
  const handleAvailability = async () => {
    const profile = JSON.parse(localStorage.getItem("Profile"));
    try {
      // dispatch(showLoading());
      if (!date || !time) {
        return toast.error("Date and Time Required");
      }
      // if(date<Date.now()||time<doctors.docSes1_start||time>doctors.docSes2_end){
      //   return toast.error("Appointment not available");
      // }
      const res = await axios.post(
        "https://med-hos-server.vercel.app/user/booking-availbility",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${profile?.token}`,
          },
        }
      );
      // dispatch(hideLoading());

      if (res.data.success) {
        setIsAvailable(true);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // dispatch(hideLoading());
      console.log(error);
    }
  };

  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      // dispatch(showLoading());
      const res = await axios.post(
        "https://med-hos-server.vercel.app/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user?.user?._id,
          doctorInfo: params.doctorId,
          userInfo: user?.user?._id,
          date: date,
          time: time,
          userName: user?.user?.name,
          doctorName: doctors?.name,
          phone: doctors?.contact,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("Profile")).token
            }`,
          },
        }
      );
      // dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      // dispatch(hideLoading());
      toast.error(error);
    }
  };

  const handleStart = async () => {};
  const { doctorId } = useParams();
  return (
    <Layout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>Dr.{doctors.name}</h4>
            <h4>Fees : {doctors.doc_fee}</h4>
            <h4>
              Timings : {doctors.docSes1_start} - {doctors.docSes2_end}{" "}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
                aria-required={"true"}
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) => {
                  setIsAvailable(false);
                  let Date = value.$D;
                  let Month = value.$M + 1;
                  let Year = value.$y;

                  if (Date < 10) Date = "0" + Date;
                  if (Month < 10) Month = "0" + Month;
                  if (Year < 10) Year = "0" + Year;
                  const formattedDate = `${Date}-${Month}-${Year}`;
                  console.log(formattedDate);
                  setDate(formattedDate);
                }}
              />
              <TimePicker
                aria-required={"true"}
                format="HH:mm"
                className="mt-3"
                onChange={(value) => {
                  console.log(value);
                  setIsAvailable(false);
                  let Hour = value.$H;
                  let Minute = value.$m;
                  if (Hour < 10) Hour = "0" + Hour;
                  if (Minute < 10) Minute = "0" + Minute;
                  const formattedTime = `${Hour}:${Minute}`;
                  console.log(formattedTime);
                  setTime(formattedTime);
                }}
              />

              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>
              {isAvailable && (
                <button className="btn btn-dark mt-2" onClick={handleBooking}>
                  Book Now
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-5">
          <h4>Video Consult</h4>
          <img src={videoImg} />
          <Button className="mt-2" type="primary">
            <NavLink to={`/consultation-Room/${doctorId}`}>Video Consult</NavLink>
          </Button>
        </div>

        <ToastContainer />
      </div>
    </Layout>
  );
};

export default BookingPage;
