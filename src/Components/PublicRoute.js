import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  if (!localStorage.getItem("Profile")) {
    return children;
  } else {
    return children;
  }
}
