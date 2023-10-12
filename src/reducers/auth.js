const authReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("Profile", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data };

    case "SIGNUP":
      localStorage.setItem("Profile", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data };

    case "GET_USER_APPOINTS":
      return { ...state, data: action?.payload };
    case "GET_ORDER":
      localStorage.setItem("orders", JSON.stringify({ ...action?.payload }));
      return { ...state, data: action?.payload };
    default:
      return state;
  }
};

export default authReducer;
