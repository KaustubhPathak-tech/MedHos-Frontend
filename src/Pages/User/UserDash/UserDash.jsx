import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserDash = () => {
  var User = useSelector((state) => state.fetch_current_userReducer);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("Profile") || Date.now() > User?.time + 3.6e6||User?.user?.userType!=="user") {
      navigate("/");
    }
  }, [navigate, User]);
  return (
    <div>
      
      <h1>User's Dashboard</h1>
      <h3>{`${User?.user?.name}`}</h3>
    </div>
  );
};

export default UserDash;
