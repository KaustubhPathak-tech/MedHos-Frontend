import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Users from "./Users";
import Doctors from "./Doctors";

import "./Home.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { addMedicine } from "../../actions/medicines";
import { message } from "antd";
// import { addMedicine } from "./redux/medicineActions"; // Assuming you have Redux set up
import { getMedicines } from "../../actions/medicines";
import AdminOrders from "./AdminOrders";
import { getAdminOrders } from "../../actions/auth";
const Home = () => {
  const User = useSelector((state) => state.fetch_cuurent_userReducer);

  const handleDateChange = (date) => {
    setFormData({ ...formData, expiry: date });
  };
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    manufacturer: "",
    price: "",
    expiry: "",
    quantityinStock: "",
    activeIngredients: "",
    dosageInstructions: "",
    storageConditions: "",
    imgurl: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addMedicine(formData)); // Assuming you have a Redux action for adding medicines
    // You can also make an API request to save data in MongoDB here
    toast.success("Medicine added successfully");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  getAdminOrders();
  useEffect(() => {
    dispatch(getMedicines());
    dispatch(getAdminOrders());
  }, [getMedicines, getAdminOrders,User]);
  return (
    <div style={{ marginTop: "5%" }}>
      <h2>Admin Panel</h2>

      <Users />
      <br />
      <hr />
      <br />
      <Doctors />
      <br />
      <hr />
      <br />
      <AdminOrders />
      <br />
      <hr />
      <br />
      <br />
      <Typography>Add Medicines</Typography>
      <div id="addMedicine">
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Expiry Date"
                value={formData.expiry}
                onChange={handleDateChange}
                fullWidth
                margin="normal"
                inputFormat="yyyy-MM-dd" // Specify the desired date format
                renderInput={(params) => <TextField {...params} />}
              />
            </DemoContainer>
          </LocalizationProvider>
          <TextField
            label="Quantity in Stock"
            name="quantityinStock"
            type="number"
            value={formData.quantityinStock}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Active Ingredients"
            name="activeIngredients"
            value={formData.activeIngredients}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Dosage Instructions"
            name="dosageInstructions"
            value={formData.dosageInstructions}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Storage Conditions"
            name="storageConditions"
            value={formData.storageConditions}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            name="imgurl"
            value={formData.imgurl}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Add more fields as needed */}

          <Button type="submit" variant="contained" color="primary">
            Add Medicine
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Home;
