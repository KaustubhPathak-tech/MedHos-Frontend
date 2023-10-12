import React, { useState, useEffect } from "react";
import Layout from "../../Components/Layout";
import "../../styles/DoctorAppointments.css";

import axios from "axios";

import moment from "moment";
import { message, Table } from "antd";
import { useSelector } from "react-redux";

const DoctorAppointments = () => {
  const user=useSelector(state=>state.fetch_cuurent_userReducer);
  const [appointments, setAppointments] = useState([]);
  const profile = JSON.parse(localStorage.getItem("Profile"));
  const getAppointments = async () => {
    try {
      const res = await axios.post(
        "https://med-hos-server.vercel.app/doctor/doctor-appointments",
        { userId: user?.user?._id },
        {
          headers: {
            Authorization: `Bearer ${profile?.token}`,
          },
        }
      );
      if (res.data.success) {
        setAppointments(res.data.data);
       
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "https://med-hos-server.vercel.app/doctor/update-status",
        { appointmentsId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${profile?.token}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAppointments();
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  const columns = [
    {
      title: "Patient Name",
      dataIndex: "name",
      render: (text, record) => <span>{record.userName}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => <span>{record.date}</span>,
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (text, record) => <span>{record.time}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="button-position">
              <button
                className="btn btn-success"
                onClick={() => handleStatus(record, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => handleStatus(record, "reject")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <Layout>
      <h1>Appoinmtnets Lists</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
};

export default DoctorAppointments;
