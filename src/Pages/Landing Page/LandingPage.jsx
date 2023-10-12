import React, { useEffect } from "react";
import "./LandingPage.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Tooltip, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospital,
  faUser,
  faUserDoctor,
  faUserNurse,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const navigate = useNavigate();
  var User = useSelector((state) => state.fetch_current_userReducer);
  useEffect(() => {
    if (Date.now() < User?.time + 3.6e6) {
      navigate(`/${User?.user?.userType}/dash`);
    }
  }, [navigate, User]);
  return (
    <div className="App-header">
      <div id="header">
        <Typography variant="h5">Choose Your Role</Typography>
      </div>
      <div className="options">
        <Box component="span" sx={{ p: 2, border: "0px dashed grey" }}>
          <Tooltip title="Login as User" arrow>
            <Button
              variant="outlined"
              sx={{ width: 200, padding: 5, margin: 0 }}
            >
              <NavLink to="/user/login">
                <FontAwesomeIcon icon={faUser} beat size="6x" />
              </NavLink>
            </Button>
          </Tooltip>
        </Box>

        <Box component="span" sx={{ p: 2, border: "0px dashed grey" }}>
          <Tooltip title="Login as Doctor" arrow>
            <Button
              variant="outlined"
              sx={{ width: 200, padding: 5, margin: 0 }}
              href="/doctor/login"
            >
              <FontAwesomeIcon icon={faUserDoctor} beat size="6x" />
            </Button>
          </Tooltip>
        </Box>

        <Box
          component="span"
          sx={{ width: 200, p: 2, border: "0px dashed grey" }}
        >
          <Tooltip title="Login as PathLab" arrow>
            <Button
              variant="outlined"
              sx={{ width: 200, padding: 5, margin: 0 }}
              href="/pathlab/login"
            >
              <FontAwesomeIcon icon={faHospital} beat size="6x" />
            </Button>
          </Tooltip>
        </Box>

        <Box
          component="span"
          sx={{ width: 200, p: 2, border: "0px dashed grey" }}
        >
          <Tooltip title="Login as Physiotherapist" arrow>
            <Button
              variant="outlined"
              sx={{ width: 200, padding: 5, margin: 0 }}
              href="/physio/login"
            >
              <FontAwesomeIcon icon={faUserNurse} beat size="6x" />
            </Button>
          </Tooltip>
        </Box>
      </div>
    </div>
  );
};

export default LandingPage;
