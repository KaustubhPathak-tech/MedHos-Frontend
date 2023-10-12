import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
export default function Payment() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const handlePayment = async (e) => {
    e.preventDefault();
    const stripe = await loadStripe(
      "pk_live_51MpOpKSDYoz6IJUAZQcoxCR50ognDEzbS6swgVU59253gVyWQXJcG4fe31g2D8N5pmt9LxvlZ6YjoFflpwyP8P0j001KZoXrDs"
    );

    const response = await axios.post(
      "https://fine-puce-hen-wig.cyclic.cloud/create-checkout-session"
    );
    
    
    const result = stripe.redirectToCheckout({ sessionId: response?.data?.id });
    if(result.error){
      console.log(result.error);
    }
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
  const ProductDisplay = () => (
    <section>
      <div className="product">
        <img
          src="https://i.imgur.com/EHyR2nP.png"
          alt="The cover of Stubborn Attachments"
        />
        <div className="description">
          <h3>Stubborn Attachments</h3>
          <h5>$20.00</h5>
        </div>
      </div>
      <form onSubmit={handlePayment}>
        <button type="submit">Checkout</button>
      </form>
    </section>
  );

  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );

  // useEffect(() => {
  //   // Check to see if this is a redirect back from Checkout
  //   const query = new URLSearchParams(window.location.search);

  //   if (query.get("success")) {
  //     setMessage("Order placed! You will receive an email confirmation.");
  //   }

  //   if (query.get("canceled")) {
  //     setMessage(
  //       "Order canceled -- continue to shop around and checkout when you're ready."
  //     );
  //   }
  // }, []);

  return <ProductDisplay />;
}
