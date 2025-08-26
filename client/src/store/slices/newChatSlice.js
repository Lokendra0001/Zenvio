import { createSlice } from "@reduxjs/toolkit"

const newChatSlice = createSlice({
    name: "newChat",
    initialState: {
        isNewChat: false
    },
    reducers: {
        toggleNewChat: (state, action) => {
            state.isNewChat = !state.isNewChat;
        }
    }
})

export const { toggleNewChat } = newChatSlice.actions;
export default newChatSlice.reducer;