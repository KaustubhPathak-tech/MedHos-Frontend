import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import "./Cart.css";
import {
  Box,
  Typography,
  styled,
  TextField,
  Paper,
  Button,
  ButtonGroup,
} from "@mui/material";
import { useSelector } from "react-redux";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Stack from "@mui/material/Stack";

import {
  decreaseQty,
  increaseQty,
  remove,
  verifyPayment,
} from "../../actions/medicines";
import { saveOrder } from "../../actions/auth";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.mode === "dark" ? "#fff" : "#1A2027",
  paddingRight: "45px",
  border: "1px solid #ded7d7",
  boxShadow: "4px 6px 10px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)",
}));
const CartContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CartItems = styled(Box)`
  width: 70%;
  overflow-y: auto;
  max-height: calc(1000vh - 50px); /* Set a maximum height for scrolling */
`;

const CartSummary = styled(Box)`
  min-height: 200px;
  margin-top: 10%;
  overflow-y: auto;
  width: 30%;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Component = styled(Box)`
  margin-top: 10px;
  background: #ffffff;
`;
const actions = styled(ButtonGroup)`
  margin-top: 30px;
  display: flex;
  border: 1px solid #fc1303;
`;

const StyledButton = styled(Button)`
  font-size: 13px;
  font-weight: 800;
  &:hover {
    background-color: #ff8605;
    color: white;
  }
`;
const Image = styled("img")({
  width: "auto",
  height: 150,
});

const Text = styled(Typography)`
  font-size: 14px;
  margin-top: 5px;
`;

const Cart = () => {
  var orderId = Math.random().toString(36).substr(2, 6);
  const [checksum, setChecksum] = useState("");

  const [placed, setPlaced] = useState(false);
  const [checked, setChecked] = useState(false);
  const [address, setAddress] = useState("");
  const changeAddress = (e) => {
    e.preventDefault();
    setChecked(true);
  };
  var totalPrice = 0;
  var totalqty = 0;
  var subtotal = 0;
  const cartItems = JSON.parse(localStorage.getItem("cart"));
  console.log(cartItems);

  const medicine = JSON.parse(localStorage.getItem("Medicines"));
  const user = useSelector((state) => state.fetch_current_userReducer);
  console.log(user);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(verifyPayment({ userId: user?.user?._id }));
  }, [dispatch, verifyPayment, checksum, user?.user?._id]);

  const handlePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51MpOpKSDYoz6IJUA995OjkPkLkzItEBJoCYfdYsXEUZmD26AjWp8I4ssGJCePQSTQY61TwlTZdF7yio4HYI0fYy600sr0LE8SC" //pk_live_51MpOpKSDYoz6IJUAZQcoxCR50ognDEzbS6swgVU59253gVyWQXJcG4fe31g2D8N5pmt9LxvlZ6YjoFflpwyP8P0j001KZoXrDs
    );
    const body = {
      product: cartItems,
      userId: user?.user?._id,
      orderId: orderId,
    };
    setChecksum(orderId);
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      "https://med-hos-server.vercel.app/create-checkout-session", //http://localhost:7000
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    console.log(response?.body);
    const session = await response.json();
    // console.log(session);
    const result = stripe.redirectToCheckout({ sessionId: session?.id });
    // if (result.error) {
    //   console.log(result.error);
    // }
    // e.preventDefault();
    // const stripe = await loadStripe(
    //   "pk_live_51MpOpKSDYoz6IJUAZQcoxCR50ognDEzbS6swgVU59253gVyWQXJcG4fe31g2D8N5pmt9LxvlZ6YjoFflpwyP8P0j001KZoXrDs"
    // );

    // const response = await axios.post(
    //   "https://fine-puce-hen-wig.cyclic.cloud/create-checkout-session"
    // );

    // const result = stripe.redirectToCheckout({ sessionId: response?.data?.id });
    // if(result.error){
    //   console.log(result.error);
    // }
    // await axios
    //   .post("http://localhost:7000/create-checkout-session", {})
    //   .then((res) => {
    //     if (res.data.url) {
    //       window.location.href = res.data.url;
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  const cartItemsDisplay = cartItems.map((cartItem) => {
    const med = medicine?.data.find(
      (item) => item._id === cartItem?.medicineId
    );
    return med ? (
      <Component>
        <Box
          key={med._id}
          textAlign="center"
          sx={{
            padding: "25px 15px",
            margin: "20px",
          }}
          width="100%"
          borderRight="1px solid #e3cecc"
          boxShadow="0 6px 10px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)"
        >
          <script>
            {(subtotal = subtotal + Number(med.price) * Number(cartItem.qty))}
            {(totalPrice = subtotal + totalPrice)}
            {(totalqty = totalqty + Number(cartItem.qty))}
          </script>
          <div className="row">
            <div className="col-md-4">
              <Image src={med.imgurl} alt="product" />
              <br />
              <br />
              <br />
              <actions style={{ paddingLeft: "20%" }}>
                <div id="qtyTracker">
                  <StyledButton
                    onClick={() => {
                      dispatch(
                        decreaseQty({
                          medicineId: med._id,
                          userId: user?.user?._id,
                        })
                      );
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }}
                    id="left"
                  >
                    -
                  </StyledButton>
                  <StyledButton
                    variant="contained"
                    style={{
                      borderRadius: "0%",
                      backgroundColor: "",
                      color: "white",
                    }}
                    id="qty"
                  >
                    {cartItem?.qty}
                  </StyledButton>
                  <StyledButton
                    onClick={() => {
                      dispatch(
                        increaseQty({
                          medicineId: med._id,
                          userId: user?.user?._id,
                        })
                      );
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }}
                    id="right"
                  >
                    +
                  </StyledButton>
                </div>
              </actions>
            </div>
            <div className="col-md-8">
              <Text style={{ fontWeight: 600, color: "#212121" }}>
                {med.name}
              </Text>
              <br />
              <Text style={{ color: "#212121", opacity: ".6" }}>
                {med.description}
              </Text>
              <div id="remove">
                <div className="row">
                  <div className="col-md-6">
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        dispatch(
                          remove({
                            medicineId: med._id,
                            userId: user?.user?._id,
                          })
                        );
                        setTimeout(() => {
                          window.location.reload();
                        }, 2000);
                      }}
                    >
                      Remove from cart
                    </Button>
                  </div>
                  <div className="col-md-6">
                    <Button variant="contained" color="primary">
                      Price &nbsp;&nbsp;&nbsp;&nbsp; ₹ {subtotal}
                    </Button>
                  </div>
                  <script>{(subtotal = 0)}</script>
                </div>
              </div>
            </div>
          </div>

          <br />
        </Box>
      </Component>
    ) : null;
  });

  return (
    <div style={{ marginTop: "5%" }}>
      {
        // Display a message if no items in cart
        cartItems?.length === 0 ? (
          <Typography variant="h6">No items in cart</Typography>
        ) : (
          <>
            <CartContent>
              <CartItems>
                <Stack spacing={2}>
                  <Item>{cartItemsDisplay}</Item>
                </Stack>
              </CartItems>
            </CartContent>
            {placed ? (
              <>
                {checked ? (
                  <></>
                ) : (
                  <>
                    <CartContent>
                      <CartSummary>
                        <Box sx={{ padding: "20px" }} id="totalPrice">
                          <LocalShippingIcon />
                          <Typography variant="h6">
                            Enter Delivery Address
                          </Typography>
                          <br />
                          <form onSubmit={changeAddress}>
                            <TextField
                              label="Delivery Address"
                              variant="outlined"
                              fullWidth
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              required
                            />
                            <br />
                            <br />
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              onClick={() => {
                                console.log(orderId);
                                handlePayment();
                                dispatch(
                                  saveOrder({
                                    user: user?.user?._id,
                                    orderItems: cartItems,
                                    shippingAddress: address,
                                    orderId: orderId,
                                  })
                                );
                              }}
                            >
                              Continue to Payment
                            </Button>
                          </form>{" "}
                          {/* Calculate and display the total price */}
                        </Box>

                        <Button
                          variant="contained"
                          color="primary"
                          hidden={placed}
                          onClick={() => {
                            setPlaced(true);
                          }}
                        >
                          Place Order
                        </Button>
                        <br />
                        <br />
                      </CartSummary>
                    </CartContent>
                  </>
                )}
              </>
            ) : (
              <>
                <CartContent>
                  <CartSummary>
                    <Box sx={{ padding: "20px" }} id="totalPrice">
                      <ShoppingCartIcon />
                      <Typography variant="h6">Cart Summary</Typography>
                      <table id="myFav">
                        <tr>
                          <td id="myTable">Total Price</td>
                          <td id="myTable1">₹ {totalPrice}</td>
                        </tr>
                        <tr>
                          <td id="myTable">Total Quantity</td>
                          <td id="myTable1">{totalqty}</td>
                        </tr>
                      </table>

                      {/* Calculate and display the total price */}
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setPlaced(true);
                      }}
                    >
                      Place Order
                    </Button>
                    <br />
                    <br />
                  </CartSummary>
                </CartContent>
              </>
            )}
          </>
        )
      }
    </div>
  );
};

export default Cart;
