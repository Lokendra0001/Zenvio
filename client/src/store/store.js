import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./slices/userSlice"
import newChatReducer from "./slices/newChatSlice"
import selectedHistoryReducer from "./slices/selectedHistory"

const store = configureStore({
    reducer: {
        auth: userReducer,
        newChat: newChatReducer,
        selectedHistory: selectedHistoryReducer,
    }
})

export default store;
