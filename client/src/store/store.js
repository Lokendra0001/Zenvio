import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"

const store = configureStore({
    reducer: {
        auth: userReducer
    }
})

export default store;
