import { combineReducers } from "redux";
import authReducer from "./auth"
import fetch_current_userReducer from "./currentUser"
import doctorReducer from "./doctor";
import medicineReducer from "./medicines";

export default combineReducers({
    authReducer,fetch_current_userReducer,doctorReducer,medicineReducer
})