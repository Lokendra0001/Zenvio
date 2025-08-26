import { createSlice } from "@reduxjs/toolkit";

const selectedHistory = createSlice({
    name: 'selectedHistory',
    initialState: {
        history: null,
        isHistory: false
    },
    reducers: {
        addHistory: (store, action) => {
            store.history = action.payload
        },
    }
})

export const { addHistory } = selectedHistory.actions
export default selectedHistory.reducer