const medicineReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "ADD_MEDICINE":
      return { ...state, data: action?.payload };
    case "GET_MEDICINES":
      localStorage.setItem("Medicines", JSON.stringify({ ...action?.payload }));
      return { ...state, data: action?.payload };
    case "ADD_TO_CART":
      localStorage.setItem("updateUser", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data };
    default:
      return state;
  }
};

export default medicineReducer;
