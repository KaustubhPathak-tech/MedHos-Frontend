import React, { useState, useEffect } from "react";
import {
  InputBase,
  Box,
  List,
  ListItem,
  styled,
  Button,
  Typography,
} from "@mui/material";
import "./UserDoctor.css";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getAllDoctors } from "../../../actions/doctor";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faUpload } from "@fortawesome/free-solid-svg-icons";

const SearchContainer = styled(Box)`
  background: #fff;
  width: 350px;
  border-radius: 0px;
  margin-left: 10px;
  display: inline-flex;
`;

const InputSearchBase = styled(InputBase)`
  padding-left: 10px;
  width: 350px;
  font-size: unset;
`;
const InputSearchBase2 = styled(InputBase)`
  padding-left: 10px;
  width: 600px;
  font-size: unset;
`;
const SeachIconWrapper = styled(Box)`
  padding: 10px;
  display: flex;
`;

const ListWrapper = styled(List)`
  position: absolute;
  background: #ffffff;
  color: #000;
  margin-top: 36px;
`;

const UserDoctor = () => {
  //detect location
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  var [city, setCity] = useState("Gorakhpur");
  const navigate = useNavigate();
  console.log(city);
  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
      setCity(weather?.name);
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });

    // Make API call to OpenWeatherMap
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=5c61d15ecbe202cf7d97d4dfe626fc88&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeather(data);
      })
      .catch((error) => console.log(error));
  }
  function error() {
    console.log("Unable to retrieve your location");
  }
  weather ? (city = weather.name) : <></>;
  const [openList1, setOpenList1] = useState(false);
  const [openList2, setOpenList2] = useState(false);

  const [doctorSearch, setDoctorSearch] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(SearchDoctors())
  }, [dispatch]);

  const getSecond = (second) => {
    setSecond(second);
  };
  const getFirst = (first) => {
    setFirst(first);
  };

  const handleCityClick = (selectedCity) => {
    setCity(selectedCity);
    setDoctorSearch("");
    setOpenList1(false);
  };

  const cities = JSON.parse(localStorage.getItem("Cities"));
  getAllDoctors();
  useEffect(() => {}, [getAllDoctors]);
  const doctors = useSelector((state) => state.doctorReducer);
  console.log(doctors);

  return (
    <div id="userDoctor">
      <div id="form">
        <SearchContainer id="city">
          <InputSearchBase
            placeholder={`${city ? city : "Enter your City"}`}
            onChange={(e) => getFirst(e.target.value)}
            onClick={() => {
              setCity("");
              setWeather(null);
            }}
            value={first}
            defaultValue={city}
          />
          <SeachIconWrapper>
            <div>
              {!location ? (
                <>
                  <Button
                    onClick={handleLocationClick}
                    data-toggle="tooltip"
                    title="Detect Your Location"
                  >
                    <FontAwesomeIcon icon={faLocation} />
                  </Button>
                  <br />
                </>
              ) : null}

              {weather ? <div></div> : null}
            </div>
          </SeachIconWrapper>
          {first && (
            <ListWrapper>
              {cities
                .filter((city) =>
                  city.toLowerCase().includes(first.toLocaleLowerCase())
                )
                .map((city,index) => index < 5 && (
                  <ListItem>
                    <Button
                      onClick={() => {
                        setFirst("");
                        handleCityClick(city);
                      }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {city}
                    </Button>
                  </ListItem>
                ))}
            </ListWrapper>
          )}
        </SearchContainer>
        <SearchContainer id="doctor">
          <InputSearchBase2
            placeholder="Search Doctors by name, speciality, and more"
            onChange={(e) => setSecond(e.target.value)}
            value={second}
            onFocus={() => setOpenList2(true)}
            onAbort={() => setOpenList2(false)}
          />
          <SeachIconWrapper data-toggle="tooltip"
                    title="Find Doctors">
            <SearchIcon />
          </SeachIconWrapper>
          {second && (
            <ListWrapper>
              {doctors?.data?.data
                .filter(
                  (doctor) =>
                    (doctor?.name
                      .toLowerCase()
                      .includes(second.toLowerCase()) &&
                      doctor?.est_city
                        .toLowerCase()
                        .includes(city.toLowerCase())) ||
                    (doctor?.specialization
                      .toLowerCase()
                      .includes(second.toLowerCase()) &&
                      doctor?.est_city
                        .toLowerCase()
                        .includes(city.toLowerCase()))
                )
                .map((doctor) => (
                  <ListItem key={doctor._id}>
                    <Button
                      onClick={() => {
                        setSecond("");
                        navigate(
                          `/user/doctor/book-appointment/${doctor?._id}`
                        );
                      }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {doctor?.name}
                    </Button>
                  </ListItem>
                ))}
            </ListWrapper>
          )}
        </SearchContainer>
      </div>
    </div>
  );
};

export default UserDoctor;
