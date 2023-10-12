import React from "react";
import { useNavigate } from "react-router-dom";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="card m-2"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/user/doctor/book-appointment/${doctor._id}`)}
      >
        <div className="card-header">Dr. {doctor.name}</div>
        <div className="card-body">
          <p>
            <b>Specialization</b> {doctor.specialization}
          </p>
          <p>
            <b>Experience</b> {doctor.doc_experience}
          </p>
          <p>
            <b>Fees Per Consultation</b> {doctor.doc_fee}
          </p>
          <p>
            <b>Timings</b> {doctor.docSes1_start} - {doctor.docSes2_end}
          </p>
        </div>
      </div>
    </>
  );
};

export default DoctorList;
