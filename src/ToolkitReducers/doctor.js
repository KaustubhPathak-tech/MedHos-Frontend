const doctorReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "GET_ALL_DOCTORS":
      return { ...state, data: action?.payload };
    default:
      return state;
  }
};

export default doctorReducer;
