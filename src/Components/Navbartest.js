import { styled } from "@mui/material";
import { useState } from "react";

const useStyles = styled((theme) => ({
  dropdown: {
    position: "relative",
    display: "inline-block",
  },
  dropdownContent: {
    display: "none",
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "#f9f9f9",
    minWidth: "160px",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
    zIndex: 1,
  },
  menuItem: {
    padding: "12px 16px",
    textDecoration: "none",
    display: "block",
    color: "#333",
    "&:hover": {
      backgroundColor: "#ddd",
    },
  },
}));

const MyComponent = () => {
  const classes = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={classes.dropdown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span>Hover me</span>
      <div
        className={classes.dropdownContent}
        style={{ display: isHovered ? "block" : "none" }}
      >
        <a href="#" className={classes.menuItem}>
          Item 1
        </a>
        <a href="#" className={classes.menuItem}>
          Item 2
        </a>
        <a href="#" className={classes.menuItem}>
          Item 3
        </a>
      </div>
    </div>
  );
};

export default MyComponent;



