import { Button } from "@mui/material";
import React from "react";
import { useSelector,useDispatch } from "react-redux";
import { useParams ,useNavigate} from "react-router-dom";
import { addtoCart } from "../../actions/medicines";
const Medicine = () => {
  const { medicineid } = useParams();
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const medicines = useSelector((state) => state.medicineReducer);
  const medicine = medicines?.data?.data.filter(
    (item) => item._id === medicineid
  );
  const handleAddtoCart = (e) => {
    e.preventDefault();
    dispatch(addtoCart({medicineId:medicine[0]?._id},navigate));
    setTimeout(() => {  window.location.reload(); }, 2000);
  };
  return (
    <div style={{ marginTop: "5%" }}>
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-image">
              <img src={`${medicine[0]?.imgurl}`} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card" style={{ minHeight: "410px" }}>
            <div className="card-content">
              <h4>Name</h4>
              <p>{medicine[0]?.name}</p>
              <br />
              <h4>Description</h4>
              <p>{medicine[0]?.description}</p>
            </div>
            <br />
            <div className="card-action">
              <h4>Manufacturer</h4>
              <p>{medicine[0]?.manufacturer}</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card">
            <div className="card-image">
              <span className="card-title">
                {" "}
                Price &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;₹ {medicine[0]?.price}
              </span>
            </div>
            <br />
            <div className="card-content">
              <Button
                variant="contained"
                color="success"
                onClick={handleAddtoCart}
              >
                Add to Cart
              </Button>
            </div>
            <div className="card-action">
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medicine;
