import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import Layout from "../Components/Layout";
import { Row } from "antd";

import DoctorList from "../Components/DoctorList";
import { getAllDoctors } from "../actions/doctor";
import { getMedicines } from "../actions/medicines";
import { useSelector } from "react-redux";
import { getUserAppointments } from "../actions/auth";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  var User = useSelector((state) => state.fetch_current_userReducer);
  const navigate = useNavigate();
  useEffect(() => {
    if (User?.user?.isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [User]);
  
  useEffect(() => {
    getMedicines();
  }, [getMedicines]);
  useEffect(() => {
    if (
      !localStorage.getItem("Profile") ||
      Date.now() > User?.time + 3.6e6 ||
      User?.user?.userType === undefined
    ) {
      navigate("/");
    }
  }, [navigate, User]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDoctors());
    dispatch(getUserAppointments());
  }, [getAllDoctors, getUserAppointments]);

  // login user data

  const doctors = useSelector((state) => state.doctorReducer);
  return (
    <Layout>
      {/* <h1 className="text-center">Home Page</h1> */}
      <Row>
        {doctors &&
          doctors?.data?.data.map((doctor) => (
            <DoctorList key={DoctorList} doctor={doctor} />
          ))}
      </Row>
    </Layout>
  );
};

export default HomePage;
