import React, { useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// var fs = require("fs");

import "./DoctorDash.css";
import { Button } from "antd";
const DoctorDash = () => {
  var User = useSelector((state) => state.fetch_current_userReducer);
  console.log(User?.user?._id);
  // const profile = JSON.parse(localStorage.getItem("Profile"));

  // const getNotification = async () => {
  //   try {
  //     const res = await axios.post(
  //       "http://localhost:7000/user/get-all-notification",
  //       {
  //         userId: User?.user?._id,
  //         userType: User?.user?.userType,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${profile?.token}`,
  //         },
  //       }
  //     );
  //     // dispatch(hideLoading());

  //     if (res.data.success) {
  //       const notification = res?.data?.notification;
  //       const seennotification = res?.data?.seennotification;
  //       localStorage.setItem("Notification", JSON.stringify({ notification }));
  //       localStorage.setItem(
  //         "SeenNotification",
  //         JSON.stringify({ seennotification })
  //       );
  //     } else {
  //       console.log(res.data.message);
  //     }
  //   } catch (error) {}
  // };

  // useEffect(() => {
  //   getNotification();
  // }, [getNotification]);

  const base64img = User?.user?.file;
  var imagefile = base64img;
  function trimBetweenCharacters(imagefile, startChar, endChar) {
    const startIdx = imagefile?.indexOf(startChar);
    const endIdx = imagefile?.indexOf(endChar, startIdx + 1); // Start searching for endChar after startChar

    if (startIdx !== -1 && endIdx !== -1) {
      const result = imagefile?.substring(startIdx + 1, endIdx);
      return result;
    } else {
      return ""; // Return an empty string if startChar or endChar is not found
    }
  }

  // Example usage:

  const startChar = ":";
  const endChar = ";";
  const result = trimBetweenCharacters(imagefile, startChar, endChar);

  function base64decoder(base64img) {
    const http = new XMLHttpRequest();
    http.onload = () => {
      var url = window.URL.createObjectURL(http.response);
      var link = document.createElement("a");
      link.href = url;
      if (result === "image/jpeg") {
        link.download = "IDProof.png";
      } else {
        link.download = "ID_Proof.pdf";
      }

      link.click();
    };
    http.responseType = "blob";
    http.open("GET", base64img, true);
    http.send();
  }
  const handleDownload = (e) => {
    e.preventDefault();
    console.log("download initiated");
    base64decoder(base64img);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !localStorage.getItem("Profile") ||
      Date.now() > User?.time + 3.6e6 ||
      User?.user?.userType !== "doctor"
    ) {
      navigate("/");
    }
  }, [navigate, User]);
  const doctorId = User?.user?._id;
  return (
    <div id="doctorDash">
      <br />
      {/* <img src={image.png} alt='image'/> */}
      <button onClick={handleDownload}>Download your Aadhaar</button>
      <Button className="mt-2" type="primary">
        <NavLink to={`/consultation-Room/${doctorId}`}>Video Consult</NavLink>
      </Button>
    </div>
  );
};

export default DoctorDash;
