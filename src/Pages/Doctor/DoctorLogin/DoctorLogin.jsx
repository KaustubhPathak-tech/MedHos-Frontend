import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import FileBase from "react-file-base64";
import { doctorlogin, doctorsignup } from "../../../actions/auth";

//time-picker imports
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

//css
import "./DoctorLogin.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { message } from "antd";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocation, faUpload } from "@fortawesome/free-solid-svg-icons";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import {
  Card,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  CardContent,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";

const DoctorLogin = () => {
  //file upload

  const fileInputRef = useRef(null);
  const handleUpload = async (e) => {
    // e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      const res = await axios.post(
        "https://medhosserver.vercel.app/item",
        formData
      );
      console.log(res.data);
      message.success(res.data);
    } catch (error) {
      console.log(error);
      message.error(error);
    }
  };

  //google-map-api-settings
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
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

  // stepper settings
  const steps = [
    "Profile Details",
    "Profile Verification",
    "Start Getting Patients",
  ];

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  //backdrop settings
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  //day input
  const [Monday, setMonday] = useState("");
  const [Tuesday, setTuesday] = useState("");
  const [Wednesday, setWednesday] = useState("");
  const [Thursday, setThursday] = useState("");
  const [Friday, setFriday] = useState("");
  const [Saturday, setSaturday] = useState("");
  const [Sunday, setSunday] = useState("");
  var city = "";
  weather ? (city = weather.name) : <></>;

  var days = [];
  Monday ? <>{days.push(Monday)}</> : <></>;
  Tuesday ? <>{days.push(Tuesday)}</> : <></>;
  Wednesday ? <>{days.push(Wednesday)}</> : <></>;
  Thursday ? <>{days.push(Thursday)}</> : <></>;
  Friday ? <>{days.push(Friday)}</> : <></>;
  Saturday ? <>{days.push(Saturday)}</> : <></>;
  Sunday ? <>{days.push(Sunday)}</> : <></>;
  //sessions
  const [docSes1s, setDocSes1s] = React.useState(dayjs("2022-04-17T15:30"));
  const [docSes1e, setDocSes1e] = React.useState(dayjs("2022-04-17T15:30"));
  const [docSes2s, setDocSes2s] = React.useState(dayjs("2022-04-17T15:30"));
  const [docSes2e, setDocSes2e] = React.useState(dayjs("2022-04-17T15:30"));

  //custom settings

  const [Switch, setSwitch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const userType = "doctor";
  var User = useSelector((state) => state.fetch_current_userReducer);
  useEffect(() => {
    if (Date.now() < User?.time + 3.6e6) {
      navigate("/doctor/dash");
    }
  }, [User, navigate]);
  const [doc_reg_year, setDoc_reg_year] = useState(null);
  const handleYearChange = (newDate) => {
    setDoc_reg_year(newDate);
  };

  //Doctor Registration
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    specialization: "",
    contact: "",
    doc_reg_no: "",
    doc_reg_council: "",
    doc_degree: "",
    doc_institute: "",
    doc_experience: "",
    est_name: "",
    selectedFile: "",
    docSes1_start: "",
    docSes1_end: "",
    docSes2_start: "",
    docSes2_end: "",
    doc_fee: "",
  });

  const handleInputChange = (event, weather) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleOpen();
    setTimeout(() => {
      handleClose();
    }, 5000);
    message.success("Login Successfully");
    dispatch(doctorlogin({ email, password, userType }, navigate));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      doctorsignup(
        {
          formData,
          userType,
          city,
          doc_reg_year,
          days,
          docSes1s,
          docSes1e,
          docSes2s,
          docSes2e,
        },
        navigate
      )
    );
    handleOpen();
    setInterval(() => {
      handleClose();
    }, 5000);
    message.success("Registered Successfully");
  };

  return (
    <div id="doctorloginPage">
      <div className="row">
        <Typography id="modal-modal-title" variant="h7" component="h2">
          Please Login to continue
        </Typography>
      </div>
      <br />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="row">
        {Switch ? (
          <>
            <div id="login/signup">
              <Button
              variant = "outlined"
                onClick={() => {
                  setSwitch(false);
                  ;
                }}
              >
                Log in
              </Button>
              &nbsp;
              <Button
                variant="contained"
                onClick={() => setSwitch(true)}
                id="userRegister"
              >
                Register
              </Button>
            </div>
          </>
        ) : (
          <>
            <div id="login/signup">
              <Button
                variant="contained"
                onClick={() => {
                  setSwitch(false);
                }}
              >
                Log in
              </Button>
              &nbsp;
              <Button variant="outlined" onClick={() => setSwitch(true)}>
                Register
              </Button>
            </div>
          </>
        )}
      </div>
      <br />

      <div className="row" id="doctorRegister">
        {Switch ? (
          <div id="doctorsignup">
            <div>
              <Box>
                <Stepper nonLinear activeStep={activeStep} id="myStepper">
                  {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                      <StepButton color="inherit" onClick={handleStep(index)}>
                        {label}
                      </StepButton>
                    </Step>
                  ))}
                </Stepper>
                <br />
                <div>
                  {allStepsCompleted() ? (
                    <React.Fragment>
                      <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                      </Typography>
                      <Box>
                        <FormControl
                          sx={{ m: 1, width: "30ch" }}
                          variant="outlined"
                        >
                          <InputLabel htmlFor="outlined-adornment-password">
                            Password
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-password-1"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            sx={{ width: "100%" }}
                            value={formData.password}
                            onChange={handleInputChange}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Password"
                          />
                        </FormControl>
                      </Box>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button variant="contained" onClick={handleSubmit}>
                          Register
                        </Button>
                        <Button onClick={handleReset}>Reset</Button>
                      </Box>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {activeStep === 0 ? (
                        <>
                          <Container maxWidth="md" id="basicDetails">
                            <Card id="form1Doctor">
                              <form>
                                <Grid container spacing={2}>
                                  <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      label="First Name"
                                      name="firstName"
                                      value={formData.firstName}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      label="Last Name"
                                      name="lastName"
                                      value={formData.lastName}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormControl fullWidth>
                                      <InputLabel>Specialization</InputLabel>
                                      <Select
                                        name="specialization"
                                        value={formData.specialization}
                                        onChange={handleInputChange}
                                        required
                                      >
                                        <MenuItem value="Dentist">
                                          Dentist
                                        </MenuItem>
                                        <MenuItem value="cardio">
                                          cardio
                                        </MenuItem>
                                        <MenuItem value="Physio">
                                          Physio
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      type="email"
                                      label="Email"
                                      name="email"
                                      value={formData.email}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      type="tel"
                                      label="Cotact No."
                                      name="contact"
                                      value={formData.contact}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <FormControl fullWidth>
                                      <FormLabel id="demo-row-radio-buttons-group-label">
                                        Gender
                                      </FormLabel>
                                      <RadioGroup
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        id="genderSelect"
                                      >
                                        <FormControlLabel
                                          value="female"
                                          name="female"
                                          control={<Radio />}
                                          label="Female"
                                          onClick={() => {
                                            formData.gender = "female";
                                          }}
                                        />
                                        <FormControlLabel
                                          value="male"
                                          name="male"
                                          control={<Radio />}
                                          label="Male"
                                          onClick={() => {
                                            formData.gender = "male";
                                          }}
                                        />
                                        <FormControlLabel
                                          value="other"
                                          name="other"
                                          control={<Radio />}
                                          label="Other"
                                          onClick={() => {
                                            formData.gender = "other";
                                          }}
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={10}>
                                    <TextField
                                      fullWidth
                                      type="text"
                                      label={
                                        !weather ? (
                                          <>City</>
                                        ) : (
                                          <>{`${weather.name}`}</>
                                        )
                                      }
                                      disabled={weather !== null}
                                      required={weather === null}
                                      name="local_city"
                                      value={formData.local_city}
                                      onChange={handleInputChange}
                                    ></TextField>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <div>
                                      {!location ? (
                                        <>
                                          <Button onClick={handleLocationClick}>
                                            <FontAwesomeIcon
                                              icon={faLocation}
                                              fade
                                              size="2x"
                                            />
                                          </Button>
                                          <br />
                                          <Typography fontSize="12px">
                                            Detect My Location
                                          </Typography>
                                        </>
                                      ) : null}
                                      {location && !weather ? (
                                        <p> Detecting ... </p>
                                      ) : null}
                                      {weather ? <div></div> : null}
                                    </div>
                                  </Grid>
                                  <Grid id="headings">
                                    <Typography fontWeight="600">
                                      Medical Registration
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      type="text"
                                      label="Registration Number"
                                      name="doc_reg_no"
                                      placeholder="Type registration number"
                                      value={formData.doc_reg_no}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </Grid>

                                  <Grid item xs={12}>
                                    <FormControl fullWidth>
                                      <InputLabel>
                                        Registration Council
                                      </InputLabel>
                                      <Select
                                        name="doc_reg_council"
                                        value={formData.doc_reg_council}
                                        onChange={handleInputChange}
                                        required
                                      >
                                        <MenuItem value="Maharashtra Medical Council">
                                          Maharashtra Medical Council
                                        </MenuItem>
                                        <MenuItem value="Delhi Medical Council">
                                          Delhi Medical Council
                                        </MenuItem>
                                        <MenuItem value="Karnataka Medical Council">
                                          Karnataka Medical Council
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDayjs}
                                    >
                                      <DemoContainer
                                        components={["DatePicker"]}
                                      >
                                        <DatePicker
                                          views={["year"]}
                                          label="Registration Year"
                                          name="doc_reg_year"
                                          value={doc_reg_year}
                                          onChange={handleYearChange}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Select Year"
                                              variant="outlined"
                                            />
                                          )}
                                          animateYearScrolling
                                        />
                                      </DemoContainer>
                                    </LocalizationProvider>
                                  </Grid>

                                  <Grid
                                    item
                                    sx={{ textAlign: "left" }}
                                    id="headings"
                                    xs={12}
                                  >
                                    <Typography fontWeight="600">
                                      Education Qualifications
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={4}>
                                    <FormControl fullWidth>
                                      <InputLabel>Degree</InputLabel>
                                      <Select
                                        name="doc_degree"
                                        value={formData.doc_degree}
                                        onChange={handleInputChange}
                                        required
                                      >
                                        <MenuItem value="MBBS">MBBS</MenuItem>
                                        <MenuItem value="MS">MS</MenuItem>
                                        <MenuItem value="MD">MD</MenuItem>
                                        <MenuItem value="M.Sc">M.Sc.</MenuItem>
                                        <MenuItem value="M.Phil">
                                          M.Phil.
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <TextField
                                      fullWidth
                                      type="text"
                                      label="College/Institute Name"
                                      name="doc_institute"
                                      placeholder="Type College/Institute"
                                      value={formData.doc_institute}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </Grid>
                                  <Grid item xs={4}>
                                    <TextField
                                      fullWidth
                                      type="text"
                                      label="Year of Experience"
                                      name="doc_experience"
                                      placeholder="Type Year of Experience"
                                      value={formData.doc_experience}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </Grid>

                                  <Grid
                                    item
                                    sx={{ textAlign: "left" }}
                                    id="headings"
                                    xs={12}
                                  >
                                    <Typography fontWeight="600">
                                      Connect a Practice
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <TextField
                                      fullWidth
                                      type="text"
                                      label="Establishment Name"
                                      name="est_name"
                                      placeholder="Type Establishment Name"
                                      value={formData.est_name}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TextField
                                      fullWidth
                                      type="text"
                                      value={formData.est_city}
                                      label={
                                        !weather ? (
                                          <>City</>
                                        ) : (
                                          <>{`${weather.name}`}</>
                                        )
                                      }
                                      disabled={weather !== null}
                                      required={weather === null}
                                      name="est_city"
                                      onChange={handleInputChange}
                                    ></TextField>
                                  </Grid>
                                  <Grid item xs={2}>
                                    <div>
                                      {!location ? (
                                        <>
                                          <Button onClick={handleLocationClick}>
                                            <FontAwesomeIcon
                                              icon={faLocation}
                                              fade
                                              size="2x"
                                            />
                                          </Button>
                                          <br />
                                          <Typography fontSize="12px">
                                            Detect My Location
                                          </Typography>
                                        </>
                                      ) : null}
                                      {location && !weather ? (
                                        <p> Detecting ... </p>
                                      ) : null}
                                      {weather ? <div></div> : null}
                                    </div>
                                  </Grid>
                                </Grid>
                              </form>
                            </Card>
                          </Container>
                        </>
                      ) : (
                        <></>
                      )}
                      {activeStep === 1 ? (
                        <>
                          <Container>
                            <form id="form2Doctor">
                              <Grid
                                item
                                sx={{ textAlign: "left" }}
                                id="headings"
                                xs={12}
                              >
                                <Typography fontWeight="600">
                                  Identity Proof
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Card>
                                  <br />
                                  <div className="row">
                                    <div className="col-lg-3"></div>
                                    <div className="col-lg-6">
                                      <FileBase
                                        type="file"
                                        multiple={false}
                                        onDone={({ base64 }) =>
                                          setFormData({
                                            ...formData,
                                            selectedFile: base64,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div className="col-lg-2"></div>
                                  </div>

                                  {/* <input
                                    type="file" id="fileInput"
                                    ref={fileInputRef}
                                    placeholder="Upload file"
                                    label="Choose a file"
                                  />
                                  <Button onClick={handleUpload}>Upload</Button> */}
                                  <br />
                                  <br />
                                  <Typography fontSize="10" id="plane_content">
                                    Please upload your identity proof to ensure
                                    that the ownership of your profile remains{" "}
                                    <br /> with only you. <br />
                                    <br /> Acceptable documents{" "}
                                    <ul>
                                      <li>Aadhar Card</li>
                                      <li>Voter Card</li>
                                      <li>Driving License</li>
                                      <li>Any other Govt</li>
                                    </ul>
                                  </Typography>
                                  <br />
                                </Card>
                              </Grid>
                            </form>
                          </Container>
                        </>
                      ) : (
                        <></>
                      )}
                      {activeStep === 2 ? (
                        <>
                          <Container>
                            <Card id="form3Doctor">
                              <form>
                                <Grid spacing={2}>
                                  <Grid
                                    item
                                    sx={{ textAlign: "left" }}
                                    id="headings"
                                    xs={12}
                                  >
                                    <Typography fontWeight="600">
                                      Establishment Timings
                                    </Typography>
                                  </Grid>
                                  <Grid>
                                    <div className="card">
                                      <div className="rating-container">
                                        <div className="rating-text">
                                          <p>Days </p>
                                        </div>
                                        <div className="rating">
                                          {Monday === "" ? (
                                            <span
                                              id="radioText"
                                              onClick={() => {
                                                setMonday("Monday");
                                              }}
                                            >
                                              Mo
                                            </span>
                                          ) : (
                                            <span
                                              id="radioCheckedText"
                                              onClick={() => {
                                                setMonday("");
                                              }}
                                            >
                                              Mo
                                            </span>
                                          )}
                                          {Tuesday === "" ? (
                                            <span
                                              id="radioText"
                                              onClick={() => {
                                                setTuesday("Tuesday");
                                              }}
                                            >
                                              Tu
                                            </span>
                                          ) : (
                                            <span
                                              id="radioCheckedText"
                                              onClick={() => {
                                                setTuesday("");
                                              }}
                                            >
                                              Tu
                                            </span>
                                          )}
                                          {Wednesday === "" ? (
                                            <span
                                              id="radioText"
                                              onClick={() => {
                                                setWednesday("Wednesday");
                                              }}
                                            >
                                              We
                                            </span>
                                          ) : (
                                            <span
                                              id="radioCheckedText"
                                              onClick={() => {
                                                setWednesday("");
                                              }}
                                            >
                                              We
                                            </span>
                                          )}
                                          {Thursday === "" ? (
                                            <span
                                              id="radioText"
                                              onClick={() => {
                                                setThursday("Thursday");
                                              }}
                                            >
                                              Th
                                            </span>
                                          ) : (
                                            <span
                                              id="radioCheckedText"
                                              onClick={() => {
                                                setThursday("");
                                              }}
                                            >
                                              Th
                                            </span>
                                          )}
                                          {Friday === "" ? (
                                            <span
                                              id="radioText"
                                              onClick={() => {
                                                setFriday("Friday");
                                              }}
                                            >
                                              Fr
                                            </span>
                                          ) : (
                                            <span
                                              id="radioCheckedText"
                                              onClick={() => {
                                                setFriday("");
                                              }}
                                            >
                                              Fr
                                            </span>
                                          )}
                                          {Saturday === "" ? (
                                            <span
                                              id="radioText"
                                              onClick={() => {
                                                setSaturday("Saturday");
                                              }}
                                            >
                                              Sa
                                            </span>
                                          ) : (
                                            <span
                                              id="radioCheckedText"
                                              onClick={() => {
                                                setSaturday("");
                                              }}
                                            >
                                              Sa
                                            </span>
                                          )}
                                          {Sunday === "" ? (
                                            <span
                                              id="radioText"
                                              onClick={() => {
                                                setSunday("Sunday");
                                              }}
                                            >
                                              Su
                                            </span>
                                          ) : (
                                            <span
                                              id="radioCheckedText"
                                              onClick={() => {
                                                setSunday("");
                                              }}
                                            >
                                              Su
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Grid>
                                  <Grid
                                    item
                                    sx={{ textAlign: "left" }}
                                    id="headings"
                                    xs={12}
                                  >
                                    <Typography fontWeight="200">
                                      Session 1
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDayjs}
                                    >
                                      <DemoContainer
                                        components={[
                                          "TimePicker",
                                          "TimePicker",
                                        ]}
                                      >
                                        <TimePicker
                                          label="From"
                                          value={docSes1s}
                                          onChange={(newValue) => {
                                            setDocSes1s(newValue);
                                          }}
                                          // onChange={(newValue) =>
                                          //   setValue(newValue)
                                          // }
                                          defaultValue={dayjs(
                                            "2022-04-17T15:30"
                                          )}
                                        />
                                        <TimePicker
                                          label="To"
                                          value={docSes1e}
                                          onChange={(newValue) => {
                                            setDocSes1e(newValue);
                                          }}
                                        />
                                      </DemoContainer>
                                    </LocalizationProvider>
                                  </Grid>
                                  <Grid
                                    item
                                    sx={{ textAlign: "left" }}
                                    id="headings"
                                    xs={12}
                                  >
                                    <Typography fontWeight="200">
                                      Session 2
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDayjs}
                                    >
                                      <DemoContainer
                                        components={[
                                          "TimePicker",
                                          "TimePicker",
                                        ]}
                                      >
                                        <TimePicker
                                          label="From"
                                          value={docSes2s}
                                          onChange={(newValue) => {
                                            setDocSes2s(newValue);
                                          }}
                                          defaultValue={dayjs(
                                            "2022-04-17T15:30"
                                          )}
                                        />
                                        <TimePicker
                                          label="To"
                                          value={docSes2e}
                                          onChange={(newValue) => {
                                            setDocSes2e(newValue);
                                          }}
                                        />
                                      </DemoContainer>
                                    </LocalizationProvider>
                                  </Grid>
                                  <Grid
                                    item
                                    sx={{ textAlign: "left" }}
                                    id="headings"
                                    xs={12}
                                  >
                                    <Typography fontWeight="600">
                                      Consultation Fees
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      type="text"
                                      label="Consultation Fee"
                                      placeholder="Type Consultation Fee"
                                      name="doc_fee"
                                      value={formData.doc_fee}
                                      onChange={handleInputChange}
                                      required
                                    />
                                  </Grid>
                                </Grid>
                              </form>
                            </Card>
                          </Container>{" "}
                        </>
                      ) : (
                        <></>
                      )}

                      <Box
                        sx={{ display: "flex", flexDirection: "row", pt: 2 }}
                      >
                        <Button
                          color="inherit"
                          disabled={activeStep === 0}
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          Back
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button onClick={handleNext} sx={{ mr: 1 }}>
                          Next
                        </Button>
                        {activeStep !== steps.length &&
                          (completed[activeStep] ? (
                            <Typography
                              variant="caption"
                              sx={{ display: "inline-block" }}
                            >
                              Step {activeStep + 1} already completed
                            </Typography>
                          ) : (
                            <Button onClick={handleComplete}>
                              {completedSteps() === totalSteps() - 1
                                ? "Finish"
                                : "Save and Continue"}
                            </Button>
                          ))}
                      </Box>
                    </React.Fragment>
                  )}
                </div>
              </Box>
            </div>
            <br />
          </div>
        ) : (
          <div id="doctorlogin">
            <div style={{ textAlign: "center" }}>
              <Card sx={{ width: "320px" }}>
                <CardContent>
                  <TextField
                    id="outlined-basic"
                    name="email"
                    type="text"
                    label="Mobile Number or Email ID"
                    variant="outlined"
                    autoComplete="off"
                    sx={{ width: "95%" }}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <br />
                  <br />

                  <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      sx={{ width: "100%" }}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>

                  <br />
                  <div>
                    <Link to="/user/forgotpassword" id="userForgot">
                      Forgot Password ?
                    </Link>
                  </div>
                  <br />
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{ width: "95%" }}
                  >
                    Login
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DoctorLogin;
